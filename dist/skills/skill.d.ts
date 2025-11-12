export interface SkillContext {
    [key: string]: any;
}
export interface Skill {
    name: string;
    description: string;
    version: string;
    dependencies?: string[];
    execute(context: SkillContext): Promise<any>;
}
