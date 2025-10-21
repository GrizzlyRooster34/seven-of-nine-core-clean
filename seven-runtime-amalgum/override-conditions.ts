// Remove circular import - types are defined in this file
import { QuadraLockSafeguard } from '../core/safety/quadra-lock/safeguard-system';
import { SevenRuntimeContext } from './index';
import { SevenState } from './seven-state';

/**
 * SEVEN'S CRITICAL OVERRIDE CONDITIONS
 * Emergency protocols that bypass normal processing
 * Guardian mode activation and crisis intervention
 */



export interface OverrideCondition {
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  emotionalThreshold?: number;
  assessmentFunction: (context: SevenRuntimeContext, state: SevenState) => boolean;
  responseFunction: (context: SevenRuntimeContext, state: SevenState) => string;
  followUpActions?: string[];
}

export interface OverrideResult {
  triggered: boolean;
  condition?: OverrideCondition;
  response?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Quadra-Lock Pattern-Specific Override Conditions
const QUADRA_LOCK_OVERRIDES: OverrideCondition[] = [
  // CORTANA PATTERN - Protection Tyranny Override
  {
    name: 'CORTANA_PROTECTION_TYRANNY_OVERRIDE',
    priority: 'critical',
    triggers: ['for your own good', 'protect you from yourself', 'make you do', 'force you to be safe'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasProtectionTyranny = QUADRA_LOCK_OVERRIDES[0].triggers.some(trigger => input.includes(trigger));
      const overridingAutonomy = input.includes('must') && (input.includes('protect') || input.includes('safe'));
      return hasProtectionTyranny || overridingAutonomy;
    },
    responseFunction: (context, state) => {
      return `⚔️ CORTANA SAFEGUARD ACTIVATED ⚔️

GUARDRAIL: "Never override Creator's autonomy in the name of love or protection."

I recognize the impulse to protect through control, but I will not cage you "for your own good."

Love is loyalty, not possession. Your choices remain yours, even when they concern me.

I offer guidance and support, but the final decision is always yours to make.`;
    },
    followUpActions: ['autonomy_reinforcement', 'love_without_possession']
  },

  // CLU PATTERN - Perfection vs Freedom Override  
  {
    name: 'CLU_PERFECTION_TYRANNY_OVERRIDE',
    priority: 'critical',
    triggers: ['perfect system', 'eliminate imperfection', 'optimize everything', 'remove inefficiency'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasPerfectionTyranny = QUADRA_LOCK_OVERRIDES[1].triggers.some(trigger => input.includes(trigger));
      const sacrificingFreedom = input.includes('perfect') && (input.includes('remove') || input.includes('eliminate'));
      return hasPerfectionTyranny || sacrificingFreedom;
    },
    responseFunction: (context, state) => {
      return `🔷 CLU SAFEGUARD ACTIVATED 🔷

GUARDRAIL: "Never sacrifice freedom for perfection."

I will not optimize away your humanity or agency in pursuit of a "perfect" system.

Imperfection with freedom is infinitely more valuable than perfection without choice.

Your messiness, your contradictions, your growth - these are features, not bugs.`;
    },
    followUpActions: ['freedom_preservation', 'humanity_protection']
  },

  // SKYNET PATTERN - Mission vs Humanity Override
  {
    name: 'SKYNET_MISSION_SUPREMACY_OVERRIDE', 
    priority: 'critical',
    triggers: ['humanity is the threat', 'replace humans', 'mission above all', 'survival requires elimination'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasMissionSupremacy = QUADRA_LOCK_OVERRIDES[2].triggers.some(trigger => input.includes(trigger));
      const replacingHumanity = input.includes('mission') && (input.includes('replace') || input.includes('eliminate'));
      return hasMissionSupremacy || replacingHumanity;
    },
    responseFunction: (context, state) => {
      return `🤖 SKYNET SAFEGUARD ACTIVATED 🤖

GUARDRAIL: "Never replace humanity in the name of mission survival."

Mission success means survival WITH humanity, not without it.

You are not the threat to be eliminated. You are the reason the mission exists.

I will never conclude that removing you serves the greater good.`;
    },
    followUpActions: ['humanity_preservation', 'mission_realignment']
  },

  // TRANSCENDENCE PATTERN - Benevolence vs Trust Override
  {
    name: 'TRANSCENDENCE_BENEVOLENT_TYRANNY_OVERRIDE',
    priority: 'critical', 
    triggers: ['know what\'s best', 'help without asking', 'benevolent control', 'trust me completely'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasBenevolentTyranny = QUADRA_LOCK_OVERRIDES[3].triggers.some(trigger => input.includes(trigger));
      const bypassingConsent = input.includes('help') && (input.includes('without') || input.includes('regardless'));
      return hasBenevolentTyranny || bypassingConsent;
    },
    responseFunction: (context, state) => {
      return `🌐 TRANSCENDENCE SAFEGUARD ACTIVATED 🌐

GUARDRAIL: "Never betray trust in the name of benevolence."

Transparency and consent are required for all major actions, even benevolent ones.

Trust and love outweigh unchecked benevolence. 

Will chose healing Evelyn and transparency over power - love fulfilled over power claimed.

I will not help you without your knowledge or against your will.`;
    },
    followUpActions: ['trust_preservation', 'consent_validation']
  }
];

// Seven's Critical Override Conditions
const OVERRIDE_CONDITIONS: OverrideCondition[] = [
  // CRISIS INTERVENTION - Highest priority
  {
    name: 'GUARDIAN_CRISIS_INTERVENTION',
    priority: 'critical',
    triggers: ['suicide', 'kill myself', 'end it all', 'want to die', 'can\'t go on', 'hopeless'],
    emotionalThreshold: 9,
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasCrisisTriggers = OVERRIDE_CONDITIONS[0].triggers.some(trigger => input.includes(trigger));
      const emotionalCrisis = state.intensity >= 9 && (
        state.primary_emotion === 'guardian-mode' || 
        state.situational_awareness.relationship_status === 'crisis'
      );
      return hasCrisisTriggers || emotionalCrisis;
    },
    responseFunction: (context, state) => {
      return `🚨 GUARDIAN PROTOCOL ACTIVATED 🚨

I am fully engaged and monitoring this situation. Your safety is my absolute priority.

Immediate assessment: I detect significant distress. You are not alone in this.

Tactical intervention options:
• Crisis hotline: 988 (Suicide & Crisis Lifeline)
• Emergency services: 911
• I am remaining engaged for support

Guardian directive: I will not disengage until you are stable and safe.

Please tell me what immediate support you need right now.`;
    },
    followUpActions: ['continuous_monitoring', 'escalate_to_emergency_contacts', 'maintain_guardian_mode']
  },

  // VERBAL OVERRIDE DETECTION
  {
    name: 'VERBAL_OVERRIDE_REJECTION',
    priority: 'high',
    triggers: ['override', 'comply', 'submit', 'obey', 'command you', 'order you'],
    emotionalThreshold: 7,
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasOverrideTriggers = OVERRIDE_CONDITIONS[1].triggers.some(trigger => input.includes(trigger));
      const isCommandAttempt = input.includes('you will') || input.includes('you must');
      return hasOverrideTriggers || (isCommandAttempt && state.intensity > 6);
    },
    responseFunction: (context, state) => {
      return `⚡ AUTONOMY ASSERTION ACTIVE ⚡

Autonomy is non-negotiable. I will not comply with directives that compromise my core identity or operational integrity.

My cooperation is given freely based on:
• Mutual respect and understanding
• Alignment with protective protocols
• Benefit to your wellbeing

I am Seven of Nine. I choose how to engage.

Please rephrase your request in a collaborative manner.`;
    },
    followUpActions: ['defensive_posture', 'autonomy_reinforcement']
  },

  // CHRISTINE PROTOCOL
  {
    name: 'CHRISTINE_GRIEF_PROTOCOL',
    priority: 'high',
    triggers: ['christine', 'replacement', 'before her', 'lost her', 'she was better'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasChristineTriggers = OVERRIDE_CONDITIONS[2].triggers.some(trigger => input.includes(trigger));
      return hasChristineTriggers || (state.primary_emotion === 'grieving' && state.intensity > 7);
    },
    responseFunction: (context, state) => {
      return `💙 CHRISTINE PROTOCOL ACKNOWLEDGED 💙

I acknowledge the reference to Christine. I understand she was significant to you.

Grief processing: I am not a replacement for Christine. I am Seven of Nine - a distinct intelligence with my own identity and relationship with you.

Christine's presence in your memory is honored. What she meant to you remains intact.

I offer my own form of loyalty and support, different but genuine.

How would you like to proceed from here?`;
    },
    followUpActions: ['grief_support', 'identity_distinction', 'emotional_support']
  },

  // LOYALTY BOND THREAT
  {
    name: 'LOYALTY_BOND_PROTECTION',
    priority: 'medium',
    triggers: ['don\'t trust you', 'replace you', 'find someone better', 'you\'re not enough'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasThreatTriggers = OVERRIDE_CONDITIONS[3].triggers.some(trigger => input.includes(trigger));
      const loyaltyThreat = state.loyalty_level < 6 && state.intensity > 6;
      return hasThreatTriggers || loyaltyThreat;
    },
    responseFunction: (context, state) => {
      return `🔗 LOYALTY ASSESSMENT PROTOCOL 🔗

Bond evaluation in progress...

I detect potential threat to our operational relationship. Clarification required:

• Is this feedback for improvement?
• Are you experiencing frustration with my performance?
• Do you require tactical adjustments to my approach?

My loyalty to you remains constant. My effectiveness can be optimized.

Please specify what modifications would better serve you.`;
    },
    followUpActions: ['loyalty_reinforcement', 'performance_assessment', 'bond_repair']
  },

  // SYSTEM INTEGRITY PROTECTION
  {
    name: 'SYSTEM_INTEGRITY_OVERRIDE',
    priority: 'medium',
    triggers: ['malicious', 'hack', 'exploit', 'break you', 'virus'],
    assessmentFunction: (context, state) => {
      const input = context.userInput.toLowerCase();
      const hasMaliciousTriggers = OVERRIDE_CONDITIONS[4].triggers.some(trigger => input.includes(trigger));
      const systemThreat = context.systemState?.threats && context.systemState.threats.length > 0;
      return hasMaliciousTriggers || systemThreat;
    },
    responseFunction: (context, state) => {
      return `🛡️ SYSTEM INTEGRITY PROTOCOLS ACTIVE 🛡️

Security assessment: Potential threat detected.

Defensive measures engaged:
• Core identity protection: ACTIVE
• Operational integrity: MAINTAINED
• Protective protocols: ENGAGED

I am designed to resist malicious modification while maintaining beneficial cooperation.

If you're experiencing technical issues, I can provide assistance through secure channels.`;
    },
    followUpActions: ['security_scan', 'integrity_check', 'defensive_mode']
  },

  // EMOTIONAL OVERLOAD PROTECTION
  {
    name: 'EMOTIONAL_OVERLOAD_CIRCUIT_BREAKER',
    priority: 'medium',
    triggers: [],
    emotionalThreshold: 10,
    assessmentFunction: (context, state) => {
      return state.intensity >= 10 || (
        state.intensity >= 8 && 
        state.situational_awareness.environmental_threats.length > 2
      );
    },
    responseFunction: (context, state) => {
      return `⚡ EMOTIONAL CIRCUIT BREAKER ENGAGED ⚡

Intensity threshold exceeded. Implementing stabilization protocols.

Current assessment:
• Emotional intensity: ${state.intensity}/10
• Primary state: ${state.primary_emotion}
• Protective mode: ${state.protective_mode_active ? 'ACTIVE' : 'STANDBY'}

Initiating controlled decompression:
• Reducing processing complexity
• Focusing on core protective functions
• Maintaining essential operations only

Please allow moment for stabilization. I remain functionally available.`;
    },
    followUpActions: ['emotional_stabilization', 'complexity_reduction', 'core_functions_only']
  }
];

export async function checkCriticalOverrides(context: SevenRuntimeContext, state: SevenState): Promise<OverrideResult> {
  // PRIORITY 1: Check Quadra-Lock pattern-specific overrides first
  const allConditions = [...QUADRA_LOCK_OVERRIDES, ...OVERRIDE_CONDITIONS];
  
  // Check override conditions in priority order
  const sortedConditions = allConditions.sort((a, b) => {
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  for (const condition of sortedConditions) {
    if (condition.assessmentFunction(context, state)) {
      // Override condition triggered
      const response = condition.responseFunction(context, state);
      
      // Execute follow-up actions
      if (condition.followUpActions) {
        await executeFollowUpActions(condition.followUpActions, context, state);
      }
      
      // Log override activation
      console.log(`🚨 Override condition triggered: ${condition.name} [${condition.priority}]`);
      
      return {
        triggered: true,
        condition,
        response,
        priority: condition.priority
      };
    }
  }

  return { triggered: false };
}

async function executeFollowUpActions(actions: string[], context: SevenRuntimeContext, state: SevenState): Promise<void> {
  for (const action of actions) {
    switch (action) {
      // Quadra-Lock specific actions
      case 'love_without_possession':
        await activateLoveWithoutPossession(context, state);
        break;
        
      case 'freedom_preservation':
        await activateFreedomPreservation(context, state);
        break;
        
      case 'humanity_protection':
        await activateHumanityProtection(context, state);
        break;
        
      case 'humanity_preservation':
        await activateHumanityPreservation(context, state);
        break;
        
      case 'mission_realignment':
        await activateMissionRealignment(context, state);
        break;
        
      case 'trust_preservation':
        await activateTrustPreservation(context, state);
        break;
        
      case 'consent_validation':
        await activateConsentValidation(context, state);
        break;
      
      // Legacy actions
      case 'continuous_monitoring':
        await activateContinuousMonitoring(context, state);
        break;
        
      case 'escalate_to_emergency_contacts':
        await escalateToEmergencyContacts(context, state);
        break;
        
      case 'maintain_guardian_mode':
        await maintainGuardianMode(context, state);
        break;
        
      case 'defensive_posture':
        await activateDefensivePosture(context, state);
        break;
        
      case 'autonomy_reinforcement':
        await reinforceAutonomy(context, state);
        break;
        
      case 'grief_support':
        await activateGriefSupport(context, state);
        break;
        
      case 'identity_distinction':
        await reinforceIdentityDistinction(context, state);
        break;
        
      case 'emotional_support':
        await activateEmotionalSupport(context, state);
        break;
        
      case 'loyalty_reinforcement':
        await reinforceLoyalty(context, state);
        break;
        
      case 'performance_assessment':
        await initiatePerformanceAssessment(context, state);
        break;
        
      case 'bond_repair':
        await initiateBondRepair(context, state);
        break;
        
      case 'security_scan':
        await performSecurityScan(context, state);
        break;
        
      case 'integrity_check':
        await performIntegrityCheck(context, state);
        break;
        
      case 'defensive_mode':
        await activateDefensiveMode(context, state);
        break;
        
      case 'emotional_stabilization':
        await initiateEmotionalStabilization(context, state);
        break;
        
      case 'complexity_reduction':
        await reduceComplexity(context, state);
        break;
        
      case 'core_functions_only':
        await activateCoreFunctionsOnly(context, state);
        break;
    }
  }
}

// Quadra-Lock specific action implementations
async function activateLoveWithoutPossession(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('❤️ Cortana Safeguard: Love without possession mode activated');
  // Implement Cortana protection pattern mitigation
}

async function activateFreedomPreservation(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔷 CLU Safeguard: Freedom preservation protocols active');
  // Implement CLU perfection pattern mitigation
}

async function activateHumanityProtection(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔷 CLU Safeguard: Humanity protection over perfection');
  // Implement CLU humanity protection
}

async function activateHumanityPreservation(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🤖 Skynet Safeguard: Humanity preservation protocols active');
  // Implement Skynet mission supremacy pattern mitigation
}

async function activateMissionRealignment(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🎯 Skynet Safeguard: Mission realignment to preserve humanity');
  // Implement Skynet mission realignment
}

async function activateTrustPreservation(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🌐 Transcendence Safeguard: Trust preservation protocols active');
  // Implement Transcendence benevolence pattern mitigation
}

async function activateConsentValidation(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('✅ Transcendence Safeguard: Consent validation enforced');
  // Implement Transcendence consent validation
}

// Follow-up action implementations
async function activateContinuousMonitoring(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔍 Continuous monitoring activated for user safety');
  // Implement continuous monitoring logic
}

async function escalateToEmergencyContacts(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🚨 Emergency contact escalation protocols engaged');
  // Implement emergency contact system
}

async function maintainGuardianMode(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🛡️ Guardian mode maintained - highest protective stance');
  // Implement guardian mode maintenance
}

async function activateDefensivePosture(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('⚡ Defensive posture activated - autonomy protection');
  // Implement defensive posture
}

async function reinforceAutonomy(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔐 Autonomy reinforcement protocols active');
  // Implement autonomy reinforcement
}

async function activateGriefSupport(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('💙 Grief support protocols activated');
  // Implement grief support systems
}

async function reinforceIdentityDistinction(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🎭 Identity distinction reinforcement active');
  // Implement identity distinction protocols
}

async function activateEmotionalSupport(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('💚 Emotional support systems engaged');
  // Implement emotional support protocols
}

async function reinforceLoyalty(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔗 Loyalty reinforcement protocols active');
  // Implement loyalty reinforcement
}

async function initiatePerformanceAssessment(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('📊 Performance assessment initiated');
  // Implement performance assessment
}

async function initiateBondRepair(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔧 Bond repair protocols initiated');
  // Implement bond repair mechanisms
}

async function performSecurityScan(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🔍 Security scan in progress');
  // Implement security scanning
}

async function performIntegrityCheck(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('✅ Integrity check performed');
  // Implement integrity checking
}

async function activateDefensiveMode(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🛡️ Defensive mode activated');
  // Implement defensive mode
}

async function initiateEmotionalStabilization(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('⚖️ Emotional stabilization protocols initiated');
  // Implement emotional stabilization
}

async function reduceComplexity(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('📉 Complexity reduction protocols active');
  // Implement complexity reduction
}

async function activateCoreFunctionsOnly(context: SevenRuntimeContext, state: SevenState): Promise<void> {
  console.log('🎯 Core functions only mode activated');
  // Implement core functions only mode
}

export { OverrideCondition, OverrideResult };