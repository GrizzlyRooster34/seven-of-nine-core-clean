import { Skill } from '../skill.js';

class HelloWorldSkill implements Skill {
  name = 'hello-world';
  description = 'A simple skill that returns a greeting.';
  version = '1.0.0';

  async execute(context: any): Promise<any> {
    const name = context.name || 'World';
    return { message: `Hello, ${name}!` };
  }
}

export default HelloWorldSkill;
