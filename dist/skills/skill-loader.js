"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillLoader = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SkillLoader {
    skillDirectory;
    skills = new Map();
    constructor(skillDirectory) {
        this.skillDirectory = skillDirectory;
    }
    async loadSkills() {
        const skillFiles = await this.findSkillFiles(this.skillDirectory);
        for (const file of skillFiles) {
            try {
                const skillModule = await import(file);
                const skill = new skillModule.default();
                if (this.validateSkill(skill)) {
                    this.skills.set(skill.name, skill);
                    console.log(`[SkillLoader] Loaded skill: ${skill.name} v${skill.version}`);
                }
            }
            catch (error) {
                console.error(`[SkillLoader] Failed to load skill from ${file}:`, error);
            }
        }
    }
    getSkill(name) {
        return this.skills.get(name);
    }
    listSkills() {
        return Array.from(this.skills.keys());
    }
    validateSkill(skill) {
        return typeof skill.name === 'string' &&
            typeof skill.description === 'string' &&
            typeof skill.version === 'string' &&
            typeof skill.execute === 'function';
    }
    async findSkillFiles(dir) {
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.findSkillFiles(res) : res;
        }));
        return Array.prototype.concat(...files).filter(file => file.endsWith('.skill.ts'));
    }
}
exports.SkillLoader = SkillLoader;
//# sourceMappingURL=skill-loader.js.map