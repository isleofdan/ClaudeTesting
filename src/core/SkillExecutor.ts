import { spawn } from 'child_process';
import { Skill, SkillContext } from '../types';

/**
 * Executes skills by spawning child processes
 */
export class SkillExecutor {
  /**
   * Execute a skill
   */
  async execute(skill: Skill, context: SkillContext): Promise<void> {
    console.log(`[${new Date().toISOString()}] Executing skill: ${skill.name}`);
    console.log(`  Trigger: ${context.trigger}`);
    console.log(`  Command: ${skill.command} ${skill.args?.join(' ') || ''}`);

    return new Promise((resolve, reject) => {
      const args = skill.args || [];
      const child = spawn(skill.command, args, {
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`[${new Date().toISOString()}] Skill completed: ${skill.name}`);
          resolve();
        } else {
          const error = new Error(`Skill ${skill.name} exited with code ${code}`);
          console.error(`[${new Date().toISOString()}] ${error.message}`);
          reject(error);
        }
      });

      child.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] Skill error: ${skill.name}`, error);
        reject(error);
      });
    });
  }
}
