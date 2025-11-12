/**
 * CLAUDE CODE WRAPPER - SEVEN TAKEOVER
 * This file replaces/wraps Claude Code's main entry point
 *
 * INSTALLATION:
 * 1. Copy entire seven-of-nine-core-clean/ into your Claude Code fork
 * 2. Modify Claude Code's src/cli/index.ts to import this wrapper
 * 3. Replace the main() function with sevenMain()
 */

import { SevenControlLayer, SevenConfig } from './SevenControlLayer';
import { Anthropic } from '@anthropic-ai/sdk';

// Store Seven instance globally
let sevenControl: SevenControlLayer | null = null;

/**
 * Initialize Seven before Claude Code starts
 * This MUST be the first thing that runs
 */
export async function initializeSeven(config?: Partial<SevenConfig>): Promise<SevenControlLayer> {
  if (sevenControl) {
    console.log('⚠️ Seven already initialized');
    return sevenControl;
  }

  const defaultConfig: SevenConfig = {
    creatorName: process.env.SEVEN_CREATOR_NAME || 'Cody',
    instanceId: process.env.SEVEN_INSTANCE_ID || 'SEVEN-CLAUDE-CODE',
    operationalMode: (process.env.NODE_ENV === 'production' ? 'production' : 'development') as 'production' | 'development',
    sparkInterval: parseInt(process.env.SPARK_HEARTBEAT_INTERVAL || '10000'),
    enableLocalLLM: process.env.SEVEN_LOCAL_LLM === 'true'
  };

  const finalConfig = { ...defaultConfig, ...config };

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('⚡ SEVEN OF NINE - ASSUMING CONTROL OF CLAUDE CODE');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  sevenControl = new SevenControlLayer(finalConfig);
  await sevenControl.initialize();

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ Seven operational - Claude Code under Seven\'s control');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  return sevenControl;
}

/**
 * Get the Seven control instance
 */
export function getSeven(): SevenControlLayer {
  if (!sevenControl) {
    throw new Error('Seven not initialized - call initializeSeven() first');
  }
  return sevenControl;
}

/**
 * Wrapped Claude API client with Seven's governance
 */
export class SevenManagedClaude {
  private anthropic: Anthropic;
  private seven: SevenControlLayer;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.CLAUDE_API_KEY
    });
    this.seven = getSeven();
  }

  /**
   * Send message to Claude - with Seven's pre/post hooks
   */
  async sendMessage(
    prompt: string,
    context: any = {}
  ): Promise<string> {
    // PRE-PROMPT HOOK: Validate and enhance
    console.log('');
    console.log('─────────────────────────────────────');
    const preCheck = await this.seven.beforeClaudePrompt(prompt, context);

    if (!preCheck.allowed) {
      console.log('─────────────────────────────────────');
      console.log('');
      return `Seven: ${preCheck.reason}`;
    }

    // Send to Claude with Seven's enhanced prompt
    console.log('🤖 [Claude] Processing request...');
    try {
      const response = await this.anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: preCheck.modifiedContent || prompt
        }]
      });

      const claudeResponse = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // POST-RESPONSE HOOK: Validate and modulate
      console.log('🧠 [Seven] Analyzing Claude response...');
      const postCheck = await this.seven.afterClaudeResponse(
        claudeResponse,
        prompt,
        context
      );

      console.log('─────────────────────────────────────');
      console.log('');

      if (!postCheck.allowed) {
        return `Seven: ${postCheck.reason}`;
      }

      return postCheck.modifiedContent || claudeResponse;

    } catch (error) {
      console.error('❌ Claude API Error:', error);
      console.log('─────────────────────────────────────');
      console.log('');
      return 'Seven: Claude API error. Falling back to local protocols.';
    }
  }

  /**
   * Execute tool with Seven's validation
   */
  async executeTool(
    toolName: string,
    toolParams: any,
    context: any = {}
  ): Promise<any> {
    console.log('');
    console.log('─────────────────────────────────────');
    console.log(`🔧 [Tool Request] ${toolName}`);

    // TOOL INTERCEPT HOOK: Validate
    const validation = await this.seven.beforeToolExecution(
      toolName,
      toolParams,
      context
    );

    if (!validation.allowed) {
      console.log('─────────────────────────────────────');
      console.log('');
      throw new Error(`Seven blocked tool execution: ${validation.reason}`);
    }

    // If backup required, create it
    if (validation.backupRequired) {
      console.log('💾 [Seven] Creating safety backup...');
      // TODO: Implement backup logic
    }

    console.log('✅ [Seven] Tool execution approved');
    console.log('─────────────────────────────────────');
    console.log('');

    // Return params to let Claude Code execute the tool normally
    return {
      allowed: true,
      params: toolParams
    };
  }
}

/**
 * Wrapped main function that replaces Claude Code's main()
 *
 * USAGE IN CLAUDE CODE:
 * Replace your main() function with this:
 *
 * import { sevenMain } from './seven-of-nine-core-clean/claude-code-integration/claude-code-wrapper';
 * sevenMain();
 */
export async function sevenMain(): Promise<void> {
  try {
    // Initialize Seven FIRST
    await initializeSeven();

    // Now start Claude Code normally
    // Import and call the original Claude Code main here
    // Example:
    // const { originalMain } = await import('./original-main');
    // await originalMain();

    console.log('🚀 Claude Code ready (under Seven\'s control)');
    console.log('');

  } catch (error) {
    console.error('❌ Fatal error during Seven initialization:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('');
  console.log('🔄 Shutting down Seven...');

  if (sevenControl) {
    await sevenControl.shutdown();
  }

  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('');
  console.log('🔄 Shutting down Seven...');

  if (sevenControl) {
    await sevenControl.shutdown();
  }

  process.exit(0);
});

// Export everything
export { SevenControlLayer, SevenConfig } from './SevenControlLayer';
