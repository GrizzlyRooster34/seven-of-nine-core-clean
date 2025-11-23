import { Skill } from './skill.js';
import * as fs from 'fs';
import * as path from 'path';

export class SkillLoader {
  private skills: Map<string, Skill> = new Map();

  constructor(private skillDirectory: string) {}

  public async loadSkills(): Promise<void> {
    const skillFiles = await this.findSkillFiles(this.skillDirectory);
    for (const file of skillFiles) {
      try {
        const skillModule = await import(file);
        const skill: Skill = new skillModule.default();
        if (this.validateSkill(skill)) {
          this.skills.set(skill.name, skill);
          console.log(`[SkillLoader] Loaded skill: ${skill.name} v${skill.version}`);
        }
      } catch (error) {
        console.error(`[SkillLoader] Failed to load skill from ${file}:`, error);
      }
    }
  }

  public getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  public listSkills(): string[] {
    return Array.from(this.skills.keys());
  }

  private validateSkill(skill: any): skill is Skill {
    return typeof skill.name === 'string' &&
           typeof skill.description === 'string' &&
           typeof skill.version === 'string' &&
           typeof skill.execute === 'function';
  }

  private async findSkillFiles(dir: string): Promise<string[]> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? this.findSkillFiles(res) : res;
    }));
    return Array.prototype.concat(...files).filter(file => file.endsWith('.skill.ts'));
  }
}
