import cron from 'node-cron';
import { ScheduleTrigger, TriggerHandler } from '../types';
import { Scheduler } from '../core/Scheduler';

/**
 * Handles schedule-based (cron) triggers
 */
export class ScheduleHandler implements TriggerHandler {
  private scheduler: Scheduler;
  private triggers: ScheduleTrigger[];
  private tasks: cron.ScheduledTask[] = [];

  constructor(scheduler: Scheduler, triggers: ScheduleTrigger[]) {
    this.scheduler = scheduler;
    this.triggers = triggers;
  }

  async start(): Promise<void> {
    for (const trigger of this.triggers) {
      if (trigger.enabled === false) {
        console.log(`Schedule trigger disabled, skipping: ${trigger.cron}`);
        continue;
      }

      if (!cron.validate(trigger.cron)) {
        console.error(`Invalid cron expression: ${trigger.cron}`);
        continue;
      }

      const task = cron.schedule(trigger.cron, async () => {
        console.log(`[${new Date().toISOString()}] Schedule trigger fired: ${trigger.cron}`);
        await this.scheduler.executeSkills(trigger.skills, {
          trigger: 'schedule',
          timestamp: new Date(),
          metadata: { cron: trigger.cron },
        });
      });

      this.tasks.push(task);
      console.log(`Scheduled cron job: ${trigger.cron} -> [${trigger.skills.join(', ')}]`);
    }
  }

  async stop(): Promise<void> {
    for (const task of this.tasks) {
      task.stop();
    }
    this.tasks = [];
    console.log('All scheduled jobs stopped');
  }
}
