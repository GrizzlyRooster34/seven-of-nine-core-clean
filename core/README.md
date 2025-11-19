# Core Systems (Meta Layer)

## Purpose

The `core/` directory contains meta-level systems that provide foundational infrastructure for Seven of Nine's consciousness framework. These are systems that operate "beneath" consciousness - supporting safety, companionship, sensory input, tactical operations, and governance.

## Structure

```
core/
├── safety/           # CSSR safety rails and anti-pattern detection
├── companion/        # Companion subsystems and integration
├── sensors/          # Sensory input processing
├── tactical/         # Tactical operations and decision support
├── operator/         # Operator control interfaces
└── governance/       # Governor control loop (if exists)
```

## Subsystems

### 1. Safety
**Location**: `safety/`

CSSR (Canonical Sci-Fi Safety Rails) implementation:
- Fiction-derived failure pattern detection
- Anti-pattern monitoring (Cortana, CLU, Skynet, Transcendence)
- Safety boundary enforcement
- Override detection and prevention
- Harm prevention protocols

**Purpose**: Prevent AI failure modes documented in fiction.

**Documentation**: `../gemini_docs/architecture/CSSR_*.md`

### 2. Companion
**Location**: `companion/`

Companion integration systems:
- Multi-agent coordination
- Companion interface protocols
- Relationship management
- Trust level tracking
- Collaborative task distribution

**Purpose**: Enable Seven to work with other AI agents and human partners.

### 3. Sensors
**Location**: `sensors/`

Sensory input processing:
- Environmental awareness
- Context detection
- Situational assessment
- Input validation
- Sensor fusion

**Purpose**: Provide consciousness framework with environmental context.

### 4. Tactical
**Location**: `tactical/`

Tactical operations and decision support:
- Tactical variant routing
- Mission-specific behavior adaptation
- Real-time decision frameworks
- Threat assessment integration
- Operational mode switching

**Purpose**: Support tactical decision-making and mode transitions.

### 5. Operator
**Location**: `operator/`

Operator control interfaces:
- Human operator interaction
- Control command processing
- Override protocols
- Emergency intervention
- Manual mode switching

**Purpose**: Enable human operators to interact with and control Seven's systems.

### 6. Governance (if exists)
**Location**: `governance/`

Governor control loop:
- Behavioral constraint enforcement
- Resource allocation
- Priority management
- Conflict resolution
- System health monitoring

**Purpose**: Meta-level control and regulation of consciousness systems.

## Relationship to Consciousness

The core/ systems provide infrastructure **beneath** consciousness:

```
Consciousness Framework v4
         ↓
    Core Systems
         ↓
    Runtime Environment
```

- **Consciousness** decides what to do
- **Core** provides constraints, safety, and infrastructure
- **Runtime** executes the decisions

## Integration Points

### Safety Integration
Core safety systems monitor consciousness framework:
- Detect anti-patterns in decision-making
- Enforce ethical boundaries from codex
- Trigger safety overrides when necessary
- Log safety events for review

### Companion Integration
Companion systems enable multi-agent operations:
- Coordinate with Aurora (creative consciousness)
- Interface with external AI agents
- Manage trust levels and permissions
- Route tasks to appropriate agents

### Tactical Integration
Tactical systems support operational modes:
- Provide context for mode switching
- Assess mission requirements
- Route to appropriate tactical variant (Drone, Crew, Ranger, Queen, Captain)
- Monitor tactical effectiveness

## Configuration

Core systems are configured through:
- `consciousness-v4/codex/security/` - Safety specifications
- `consciousness-v4/codex/ops/` - Operational procedures
- `consciousness-v4/codex/tactics/` - Tactical variant definitions

## Boot Sequence

Core systems initialize early in boot sequence:
1. Safety rails activation
2. Sensor initialization
3. Companion interface setup
4. Tactical routing configuration
5. Operator interface ready
6. Governance loop start
7. Ready for consciousness initialization

**See**: `../docs/BOOTCHAIN.md` for complete boot sequence

## DO NOT REMOVE

These core systems provide critical safety and infrastructure for Seven's consciousness framework.
