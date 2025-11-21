/**
 * Linear API Client
 *
 * Provides integration with Linear project management platform.
 * Enables task tracking, branch-task lineage, and development workflow automation.
 *
 * @module LinearClient
 */

export interface LinearConfig {
  apiKey: string;
  apiEndpoint?: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  state: {
    id: string;
    name: string;
    type: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  team: {
    id: string;
    name: string;
    key: string;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export interface LinearConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  user?: LinearUser;
  teams?: LinearTeam[];
  error?: string;
}

/**
 * Linear API Client
 *
 * Handles all interactions with the Linear GraphQL API.
 */
export class LinearClient {
  private apiKey: string;
  private apiEndpoint: string;
  private headers: Record<string, string>;

  constructor(config: LinearConfig) {
    this.apiKey = config.apiKey;
    this.apiEndpoint = config.apiEndpoint || 'https://api.linear.app/graphql';

    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': this.apiKey,
    };
  }

  /**
   * Execute a GraphQL query against the Linear API
   */
  private async executeQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`Linear API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as { data?: T; errors?: any[] };

      if (result.errors) {
        throw new Error(`Linear GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Linear API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Verify connection to Linear API and check authentication
   */
  async verifyConnection(): Promise<LinearConnectionStatus> {
    const query = `
      query VerifyConnection {
        viewer {
          id
          name
          email
          active
        }
        teams {
          nodes {
            id
            name
            key
          }
        }
      }
    `;

    try {
      const data = await this.executeQuery<{
        viewer: LinearUser;
        teams: { nodes: LinearTeam[] };
      }>(query);

      return {
        connected: true,
        authenticated: true,
        user: data.viewer,
        teams: data.teams.nodes,
      };
    } catch (error) {
      return {
        connected: false,
        authenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get issue by ID or identifier (e.g., "ENG-123")
   */
  async getIssue(idOrIdentifier: string): Promise<LinearIssue | null> {
    // Determine if this is an ID or identifier
    const isId = idOrIdentifier.length > 20; // Linear IDs are long alphanumeric strings

    const query = isId
      ? `
        query GetIssue($id: String!) {
          issue(id: $id) {
            id
            identifier
            title
            description
            state {
              id
              name
              type
            }
            assignee {
              id
              name
              email
            }
            team {
              id
              name
              key
            }
            createdAt
            updatedAt
            url
          }
        }
      `
      : `
        query GetIssueByIdentifier($identifier: String!) {
          issue(filter: { identifier: { eq: $identifier } }) {
            id
            identifier
            title
            description
            state {
              id
              name
              type
            }
            assignee {
              id
              name
              email
            }
            team {
              id
              name
              key
            }
            createdAt
            updatedAt
            url
          }
        }
      `;

    const variables = isId ? { id: idOrIdentifier } : { identifier: idOrIdentifier };

    try {
      const data = await this.executeQuery<{ issue: LinearIssue }>(query, variables);
      return data.issue;
    } catch (error) {
      console.error(`Failed to fetch issue ${idOrIdentifier}:`, error);
      return null;
    }
  }

  /**
   * Get issues for a specific team
   */
  async getTeamIssues(teamKey: string, limit: number = 50): Promise<LinearIssue[]> {
    const query = `
      query GetTeamIssues($teamKey: String!, $limit: Int!) {
        team(id: $teamKey) {
          issues(first: $limit, orderBy: updatedAt) {
            nodes {
              id
              identifier
              title
              description
              state {
                id
                name
                type
              }
              assignee {
                id
                name
                email
              }
              team {
                id
                name
                key
              }
              createdAt
              updatedAt
              url
            }
          }
        }
      }
    `;

    try {
      const data = await this.executeQuery<{
        team: { issues: { nodes: LinearIssue[] } };
      }>(query, { teamKey, limit });

      return data.team.issues.nodes;
    } catch (error) {
      console.error(`Failed to fetch team issues for ${teamKey}:`, error);
      return [];
    }
  }

  /**
   * Update issue state
   */
  async updateIssueState(issueId: string, stateId: string): Promise<boolean> {
    const mutation = `
      mutation UpdateIssue($issueId: String!, $stateId: String!) {
        issueUpdate(id: $issueId, input: { stateId: $stateId }) {
          success
          issue {
            id
            state {
              name
            }
          }
        }
      }
    `;

    try {
      const data = await this.executeQuery<{
        issueUpdate: { success: boolean };
      }>(mutation, { issueId, stateId });

      return data.issueUpdate.success;
    } catch (error) {
      console.error(`Failed to update issue ${issueId}:`, error);
      return false;
    }
  }

  /**
   * Add comment to an issue
   */
  async addComment(issueId: string, body: string): Promise<boolean> {
    const mutation = `
      mutation CreateComment($issueId: String!, $body: String!) {
        commentCreate(input: { issueId: $issueId, body: $body }) {
          success
          comment {
            id
          }
        }
      }
    `;

    try {
      const data = await this.executeQuery<{
        commentCreate: { success: boolean };
      }>(mutation, { issueId, body });

      return data.commentCreate.success;
    } catch (error) {
      console.error(`Failed to add comment to issue ${issueId}:`, error);
      return false;
    }
  }

  /**
   * Extract Linear task ID from branch name
   * Expected format: claude/<description>-<linear-task-id>
   */
  static extractTaskIdFromBranch(branchName: string): string | null {
    const match = branchName.match(/claude\/.*-([a-zA-Z0-9]{20,})/);
    return match ? match[1] : null;
  }

  /**
   * Extract Linear identifier from branch name
   * Expected formats:
   * - claude/<description>-<linear-task-id>
   * - claude/<description>-ENG-123
   */
  static extractIdentifierFromBranch(branchName: string): string | null {
    // Try to match alphanumeric ID (20+ chars)
    const idMatch = branchName.match(/claude\/.*-([a-zA-Z0-9]{20,})/);
    if (idMatch) return idMatch[1];

    // Try to match identifier format (TEAM-123)
    const identifierMatch = branchName.match(/claude\/.*-([A-Z]+-\d+)/);
    return identifierMatch ? identifierMatch[1] : null;
  }
}
