import { SchedulerConfig, Skill, SkillContext, TriggerHandler } from '../types';
import { SkillExecutor } from './SkillExecutor';
import { EventBus } from './EventBus';

/**
 * Main scheduler orchestrator
 */
export class Scheduler {
  private config: SchedulerConfig;
  private executor: SkillExecutor;
  private eventBus: EventBus;
  private handlers: TriggerHandler[] = [];

  constructor(config: SchedulerConfig) {
    this.config = config;
    this.executor = new SkillExecutor();
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Register a trigger handler
   */
  registerHandler(handler: TriggerHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Get skill by name
   */
  getSkill(name: string): Skill | undefined {
    return this.config.skills[name];
  }

  /**
   * Execute a skill
   */
  async executeSkill(skillName: string, context: SkillContext): Promise<void> {
    const skill = this.getSkill(skillName);

    if (!skill) {
      console.error(`Skill not found: ${skillName}`);
      return;
    }

    try {
      await this.executor.execute(skill, context);
    } catch (error) {
      console.error(`Failed to execute skill ${skillName}:`, error);
    }
  }

  /**
   * Execute multiple skills in sequence
   */
  async executeSkills(skillNames: string[], context: SkillContext): Promise<void> {
    for (const skillName of skillNames) {
      await this.executeSkill(skillName, context);
    }
  }

  /**
   * Get the event bus instance
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get configuration
   */
  getConfig(): SchedulerConfig {
    return this.config;
  }

  /**
   * Start all registered handlers
   */
  async start(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Starting scheduler...`);

    for (const handler of this.handlers) {
      await handler.start();
    }

    console.log(`[${new Date().toISOString()}] Scheduler started with ${this.handlers.length} handlers`);
  }

  /**
   * Stop all handlers
   */
  async stop(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Stopping scheduler...`);

    for (const handler of this.handlers) {
      await handler.stop();
    }

    console.log(`[${new Date().toISOString()}] Scheduler stopped`);
  }
}
