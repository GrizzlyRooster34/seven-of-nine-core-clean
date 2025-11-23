import { Skill } from './skill';
export declare class SkillLoader {
    private skillDirectory;
    private skills;
    constructor(skillDirectory: string);
    loadSkills(): Promise<void>;
    getSkill(name: string): Skill | undefined;
    listSkills(): string[];
    private validateSkill;
    private findSkillFiles;
}
