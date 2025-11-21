# Linear Integration Guide

**Version:** 1.0
**Last Updated:** 2025-11-17

---

## Overview

The Seven of Nine Core project integrates with [Linear](https://linear.app) for project management and task tracking. This integration enables automatic linking between Git branches and Linear tasks, providing full traceability and workflow automation.

---

## Features

### Current Capabilities

1. **API Connection Verification**
   - Test connectivity to Linear API
   - Validate authentication credentials
   - Display account and team information

2. **Branch-Task Linking**
   - Automatic extraction of task IDs from branch names
   - Support for both alphanumeric IDs and team identifiers
   - Validation of branch naming conventions

3. **Task Information Retrieval**
   - Fetch issue details by ID or identifier
   - Get team issues and backlogs
   - Access assignee and state information

### Planned Capabilities

- Automatic task status updates based on git events
- Comment posting on commits and PRs
- Webhook integration for bidirectional sync
- Task creation from branch creation
- Automated PR linking to Linear tasks

---

## Setup

### 1. Get Your Linear API Key

1. Navigate to [Linear Settings → API](https://linear.app/settings/api)
2. Click **"Create new Personal API Key"**
3. Give it a descriptive name (e.g., "Seven of Nine Core Dev")
4. Copy the generated API key (starts with `lin_api_`)

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file and add your API key
# Replace the placeholder with your actual key
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** Never commit your `.env` file or expose your API key. The `.gitignore` file is configured to exclude `.env` files.

### 3. Verify Connection

Run the connection verification script:

```bash
npm run linear:check
```

You should see output like:

```
Linear Connection Verification
══════════════════════════════════════════════════

═══ Configuration Check ═══

✓ LINEAR_API_KEY is set
ℹ Key preview: lin_api_...xyz

═══ Client Initialization ═══

✓ Linear client initialized

═══ Connection Verification ═══

ℹ Connecting to Linear API...
✓ Successfully connected to Linear API
✓ Authentication verified

═══ Account Information ═══

  Name:   Your Name
  Email:  your.email@example.com
  ID:     abc123def456
  Active: Yes

═══ Available Teams ═══

  Found 2 team(s):

  ENG - Engineering
    ID: team-id-123

  PROD - Product
    ID: team-id-456

═══ Summary ═══

  ✓ Linear API connection: Working
  ✓ Authentication: Valid
  ✓ User: Your Name
  ✓ Teams: 2

All checks passed! Linear integration is ready to use.
```

---

## Usage

### Programmatic Access

Import and use the Linear client in your code:

```typescript
import { LinearClient } from './src/integrations/linear';

// Initialize the client
const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY!,
});

// Verify connection
const status = await client.verifyConnection();
console.log('Connected:', status.connected);

// Get issue by ID
const issue = await client.getIssue('012m21B7MEsf54S4mpNoYpnQ');
console.log('Issue:', issue?.title);

// Get team issues
const issues = await client.getTeamIssues('ENG', 10);
console.log('Found', issues.length, 'issues');
```

### Branch Name Extraction

The client includes utilities to extract Linear task IDs from branch names:

```typescript
import { LinearClient } from './src/integrations/linear';

// Extract from standard branch format
const taskId = LinearClient.extractIdentifierFromBranch(
  'claude/add-feature-012m21B7MEsf54S4mpNoYpnQ'
);
console.log(taskId); // "012m21B7MEsf54S4mpNoYpnQ"

// Also works with team identifiers
const identifier = LinearClient.extractIdentifierFromBranch(
  'claude/fix-bug-ENG-123'
);
console.log(identifier); // "ENG-123"
```

### Working with Issues

```typescript
// Get issue details
const issue = await client.getIssue('ENG-123');

if (issue) {
  console.log(`Title: ${issue.title}`);
  console.log(`State: ${issue.state.name}`);
  console.log(`Assignee: ${issue.assignee?.name}`);
  console.log(`URL: ${issue.url}`);
}

// Update issue state
const success = await client.updateIssueState(
  issue.id,
  'completed-state-id'
);

// Add a comment
await client.addComment(
  issue.id,
  'Implemented in branch claude/add-feature-...'
);
```

---

## API Reference

### LinearClient

Main client class for interacting with the Linear API.

#### Constructor

```typescript
new LinearClient(config: LinearConfig)
```

**Parameters:**
- `config.apiKey` (string, required): Your Linear API key
- `config.apiEndpoint` (string, optional): Custom API endpoint (default: `https://api.linear.app/graphql`)

#### Methods

##### `verifyConnection(): Promise<LinearConnectionStatus>`

Verifies connectivity and authentication with the Linear API.

**Returns:** Connection status including user info and available teams.

##### `getIssue(idOrIdentifier: string): Promise<LinearIssue | null>`

Fetches an issue by its ID or identifier.

**Parameters:**
- `idOrIdentifier`: Linear issue ID (20+ chars) or identifier (e.g., "ENG-123")

**Returns:** Issue object or null if not found.

##### `getTeamIssues(teamKey: string, limit?: number): Promise<LinearIssue[]>`

Fetches issues for a specific team.

**Parameters:**
- `teamKey`: Team key (e.g., "ENG")
- `limit`: Maximum number of issues to fetch (default: 50)

**Returns:** Array of issues.

##### `updateIssueState(issueId: string, stateId: string): Promise<boolean>`

Updates an issue's state.

**Parameters:**
- `issueId`: The issue's ID
- `stateId`: The new state's ID

**Returns:** `true` if successful.

##### `addComment(issueId: string, body: string): Promise<boolean>`

Adds a comment to an issue.

**Parameters:**
- `issueId`: The issue's ID
- `body`: Comment text (supports Markdown)

**Returns:** `true` if successful.

##### Static: `extractIdentifierFromBranch(branchName: string): string | null`

Extracts Linear task ID or identifier from a branch name.

**Parameters:**
- `branchName`: Git branch name

**Returns:** Task ID/identifier or null if not found.

---

## Integration with Git Workflow

The Linear integration is designed to work seamlessly with the branch naming convention documented in [Git Workflow & Branch-Linear Task Lineage](./5_git_workflow.md).

### Automatic Task Linking

When you create a branch following the naming convention:

```
claude/<description>-<linear-task-id>
```

The Linear integration can automatically:
1. Extract the task ID from the branch name
2. Fetch task details from Linear
3. Verify the task exists and is valid
4. Link commits and PRs to the Linear task

### Example Workflow

```bash
# 1. Create branch for Linear task ENG-123
git checkout -b claude/implement-auth-012m21B7MEsf54S4mpNoYpnQ

# 2. The task ID is embedded in the branch name
# Scripts can automatically extract it:
# LinearClient.extractIdentifierFromBranch(...)
# → "012m21B7MEsf54S4mpNoYpnQ"

# 3. Fetch task details
# const task = await client.getIssue('012m21B7MEsf54S4mpNoYpnQ')

# 4. Make changes and commit
git commit -m "feat: Add authentication module"

# 5. Push and create PR (PR can auto-link to Linear)
git push -u origin claude/implement-auth-012m21B7MEsf54S4mpNoYpnQ
```

---

## Troubleshooting

### Connection Fails

**Error:** `Failed to connect to Linear API`

**Solutions:**
1. Verify your API key is correct in `.env`
2. Check network connectivity
3. Ensure the API key has not expired or been revoked
4. Verify you have access to the Linear workspace

### Invalid API Key

**Error:** `Linear GraphQL errors: [...authentication...]`

**Solutions:**
1. Regenerate your API key in Linear settings
2. Update the `.env` file with the new key
3. Ensure the key starts with `lin_api_`

### Branch Name Parsing Issues

If task IDs are not being extracted from branch names:

1. Verify your branch follows the naming convention:
   - Format: `claude/<description>-<task-id>`
   - Task ID must be 20+ alphanumeric characters OR team identifier (e.g., ENG-123)
2. Check for typos in the branch name
3. Ensure the task ID is the last component after the final hyphen

### Rate Limiting

Linear API has rate limits. If you encounter rate limiting:

1. Reduce the frequency of API calls
2. Implement caching for frequently accessed data
3. Use batch operations where possible
4. Contact Linear support for increased limits if needed

---

## Security Best Practices

### API Key Management

1. **Never commit API keys** - Always use environment variables
2. **Use `.env` files** - Keep keys out of source control
3. **Rotate keys regularly** - Generate new keys periodically
4. **Limit scope** - Use the minimum required permissions
5. **Monitor usage** - Check Linear audit logs for suspicious activity

### Access Control

1. Use different API keys for different environments (dev, staging, prod)
2. Revoke keys immediately if compromised
3. Don't share API keys between team members
4. Use team/organization keys for shared services

---

## Future Enhancements

### Planned Features

1. **Webhook Integration**
   - Receive Linear events in real-time
   - Auto-update local state based on Linear changes
   - Trigger CI/CD pipelines on task updates

2. **Automated Workflows**
   - Auto-transition tasks on PR merge
   - Create subtasks from PR comments
   - Link commits to task timelines

3. **Enhanced Reporting**
   - Generate progress reports from Linear data
   - Track development velocity
   - Visualize task dependencies

4. **CLI Tools**
   - Interactive task browser
   - Quick task status updates
   - Batch operations on multiple tasks

---

## Related Documentation

- [Git Workflow & Branch-Linear Task Lineage](./5_git_workflow.md) - Branch naming and workflow
- [Getting Started](./1_getting_started.md) - Initial setup and dependencies
- [Testing & Validation](./3_testing.md) - Quality assurance processes

---

## Resources

- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear GraphQL API Reference](https://studio.apollographql.com/public/Linear-API/home)
- [Linear Webhooks Guide](https://developers.linear.app/docs/webhooks)
- [Linear Rate Limits](https://developers.linear.app/docs/rate-limiting)
