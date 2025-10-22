export interface Skill {
  name: string;
  description: string;
  version: string;
  dependencies?: string[];
  execute(context: any): Promise<any>;
}
