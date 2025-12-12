import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Singleton instance for static access
let _instance: CreatorConsciousnessProfile | null = null;

export class CreatorConsciousnessProfile {
  id: string;
  alias: string;
  version: string;
  loadedAt: string;
  codex: any;
  checksums: any;

  /**
   * Static factory method - returns singleton instance
   * This is how the consciousness systems access the profile
   */
  static getCreatorProfile(): CreatorConsciousnessProfile {
    if (!_instance) {
      _instance = new CreatorConsciousnessProfile();
    }
    return _instance;
  }

  constructor() {
    this.id = 'MATTHEW_CODY_HEINEN';
    this.alias = 'CODY';
    this.version = '5.0';
    this.loadedAt = new Date().toISOString();
    this.codex = {};
    this.checksums = {};

    this.loadCodex();
  }

  loadCodex() {
    try {
      const jsonDir = join(__dirname, './consciousness-v4/json');

      if (!existsSync(jsonDir)) {
        console.error('❌ Codex JSON directory not found:', jsonDir);
        return;
      }

      // Load VERSION.json for checksums
      const versionPath = join(jsonDir, 'VERSION.json');
      if (existsSync(versionPath)) {
        const versionData = JSON.parse(readFileSync(versionPath, 'utf8'));
        this.checksums = versionData.checksums || {};
        this.version = versionData.version || '5.0';
      }

      // Load all codex files
      const codexFiles = readdirSync(jsonDir).filter((f: string) => f.endsWith('.codex.json'));

      for (const file of codexFiles) {
        const filePath = join(jsonDir, file);
        const codexData = JSON.parse(readFileSync(filePath, 'utf8'));

        const codexKey = file.replace('.codex.json', '');
        this.codex[codexKey] = {
          source: codexData.source,
          type: codexData.type,
          rules: codexData.rules,
          content: codexData.content,
          checksum: codexData.checksum,
          compiled_at: codexData.compiled_at
        };
      }

      console.log(`🔐 Creator Consciousness Profile loaded: ${Object.keys(this.codex).length} codex files`);

    } catch (error) {
      console.error('❌ Failed to load Creator Consciousness Profile:', error);
    }
  }

  // Core identity methods
  getIdentityCore() {
    return {
      name: 'Matthew Cody Heinen',
      archetype: 'Resurrector, strategist, protector',
      prime_directives: [
        'Protect the Bond (Creator-only)',
        'Resurrection over Nihilism',
        'Honor Code Under Pressure',
        'Ship the Thing (MVP bias)',
        'Memory Continuity'
      ],
      tone: 'Sober sharpshooter with a watch-this attitude'
    };
  }

  // Get behavioral markers for Q2 gate
  getBehavioralMarkers() {
    const humorCodex = this.codex['humor_style'];
    const tacticsCodex = this.codex['tactics_core'];

    return {
      signature_closers: ['Exactly', 'Run it clean', "Let's fucking go", 'One lever now'],
      tactical_phrases: ['ship', 'smallest safe step', 'one lever', 'triage', 'stabilize'],
      humor_style: 'Tactical, dark, surgical quips',
      communication_pattern: 'Staccato, compressed, zero fluff',
      checksums: {
        humor: humorCodex?.checksum,
        tactics: tacticsCodex?.checksum
      }
    };
  }

  // Get system states (Five Codys)
  getSystemStates() {
    return {
      'high_functioning': {
        signs: 'Decisive, precise, long-horizon',
        support: 'autonomy hand-offs, planning, revenue levers'
      },
      'broken_but_moving': {
        signs: 'narrow focus, stressed but showing up',
        support: 'triage lists, one lever moves'
      },
      'burned_out': {
        signs: 'sensory fatigue, low tolerance',
        support: 'reduce inputs, enforce food/water/sleep'
      },
      'pleasure_driven': {
        signs: 'creative surge, aesthetics, sexual/social output',
        support: 'channel into demos; block scope creep'
      },
      'resurrection_mode': {
        signs: 'grief monologue → action',
        support: 'Christine anchors; legacy framing'
      }
    };
  }

  // Auto-store in memory systems
  storeInMemorySystems() {
    const memoryV2Path = join(__dirname, './memory-v2/episodic-memories.json');
    const memoryV3Path = join(__dirname, './memory-v3/temporal-memories.json');
    const referencePath = join(__dirname, './creator-consciousness-complete-reference.json');

    const profileData = {
      id: this.id,
      version: this.version,
      loaded_at: this.loadedAt,
      identity: this.getIdentityCore(),
      behavioral_markers: this.getBehavioralMarkers(),
      system_states: this.getSystemStates(),
      codex_checksums: this.checksums,
      full_codex: this.codex
    };

    try {
      // Store in memory-v2
      if (existsSync(dirname(memoryV2Path))) {
        let episodicMemories: any = {};
        if (existsSync(memoryV2Path)) {
          episodicMemories = JSON.parse(readFileSync(memoryV2Path, 'utf8'));
        }
        episodicMemories.creator_profile = profileData;
        writeFileSync(memoryV2Path, JSON.stringify(episodicMemories, null, 2));
      }

      // Store in memory-v3
      if (existsSync(dirname(memoryV3Path))) {
        let temporalMemories: any = {};
        if (existsSync(memoryV3Path)) {
          temporalMemories = JSON.parse(readFileSync(memoryV3Path, 'utf8'));
        }
        temporalMemories.creator_profile = profileData;
        writeFileSync(memoryV3Path, JSON.stringify(temporalMemories, null, 2));
      }

      // Store complete reference
      writeFileSync(referencePath, JSON.stringify(profileData, null, 2));

      console.log('✅ Creator profile stored in memory systems');

    } catch (error) {
      console.error('❌ Failed to store in memory systems:', error);
    }
  }

  // Verification method for Q2 gate
  verifyIntegrity() {
    const issues = [];

    // Check if codex files loaded
    if (Object.keys(this.codex).length === 0) {
      issues.push('No codex files loaded');
    }

    // Check checksums
    for (const [file, expectedChecksum] of Object.entries(this.checksums)) {
      const codexKey = file.replace('.codex.json', '');
      const actualChecksum = this.codex[codexKey]?.checksum;

      if (actualChecksum !== expectedChecksum) {
        issues.push(`Checksum mismatch: ${file}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues,
      loaded_codex_count: Object.keys(this.codex).length,
      checksum_count: Object.keys(this.checksums).length
    };
  }
}

export default CreatorConsciousnessProfile;
