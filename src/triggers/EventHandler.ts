import { EventTrigger, TriggerHandler } from '../types';
import { Scheduler } from '../core/Scheduler';
import { EventBus } from '../core/EventBus';

/**
 * Handles custom event bus triggers
 */
export class EventHandler implements TriggerHandler {
  private scheduler: Scheduler;
  private triggers: EventTrigger[];
  private eventBus: EventBus;
  private listeners: Map<string, (metadata?: Record<string, any>) => void> = new Map();

  constructor(scheduler: Scheduler, triggers: EventTrigger[]) {
    this.scheduler = scheduler;
    this.triggers = triggers;
    this.eventBus = scheduler.getEventBus();
  }

  async start(): Promise<void> {
    for (const trigger of this.triggers) {
      if (trigger.enabled === false) {
        console.log(`Event trigger disabled, skipping: ${trigger.eventName}`);
        continue;
      }

      const listener = async (metadata?: Record<string, any>) => {
        console.log(`[${new Date().toISOString()}] Custom event triggered: ${trigger.eventName}`);
        await this.scheduler.executeSkills(trigger.skills, {
          trigger: 'event',
          timestamp: new Date(),
          metadata: metadata || {},
        });
      };

      this.eventBus.on(trigger.eventName, listener);
      this.listeners.set(trigger.eventName, listener);

      console.log(`Event listener registered: ${trigger.eventName} -> [${trigger.skills.join(', ')}]`);
    }
  }

  async stop(): Promise<void> {
    for (const [eventName, listener] of this.listeners.entries()) {
      this.eventBus.off(eventName, listener);
    }
    this.listeners.clear();
    console.log('All event listeners removed');
  }
}
