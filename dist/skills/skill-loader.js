import * as fs from 'fs';
import * as path from 'path';
export class SkillLoader {
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
//# sourceMappingURL=skill-loader.js.map