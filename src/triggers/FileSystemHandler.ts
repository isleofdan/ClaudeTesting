import chokidar, { FSWatcher } from 'chokidar';
import { FileSystemTrigger, TriggerHandler } from '../types';
import { Scheduler } from '../core/Scheduler';

/**
 * Handles file system event triggers
 */
export class FileSystemHandler implements TriggerHandler {
  private scheduler: Scheduler;
  private triggers: FileSystemTrigger[];
  private watchers: FSWatcher[] = [];

  constructor(scheduler: Scheduler, triggers: FileSystemTrigger[]) {
    this.scheduler = scheduler;
    this.triggers = triggers;
  }

  async start(): Promise<void> {
    for (const trigger of this.triggers) {
      if (trigger.enabled === false) {
        console.log(`File system trigger disabled, skipping: ${trigger.watch}`);
        continue;
      }

      const paths = Array.isArray(trigger.watch) ? trigger.watch : [trigger.watch];
      const events = trigger.events || ['add', 'change', 'unlink'];

      const watcher = chokidar.watch(paths, {
        persistent: true,
        ignoreInitial: true,
        ...(trigger.pattern ? { ignored: `!${trigger.pattern}` } : {}),
      });

      // Map chokidar events to our event types
      if (events.includes('add')) {
        watcher.on('add', (path) => this.handleEvent('add', path, trigger));
      }
      if (events.includes('change')) {
        watcher.on('change', (path) => this.handleEvent('change', path, trigger));
      }
      if (events.includes('unlink')) {
        watcher.on('unlink', (path) => this.handleEvent('unlink', path, trigger));
      }

      this.watchers.push(watcher);
      console.log(`Watching file system: ${paths.join(', ')} -> [${trigger.skills.join(', ')}]`);
    }
  }

  private async handleEvent(event: string, path: string, trigger: FileSystemTrigger): Promise<void> {
    console.log(`[${new Date().toISOString()}] File system event: ${event} on ${path}`);
    await this.scheduler.executeSkills(trigger.skills, {
      trigger: 'filesystem',
      timestamp: new Date(),
      metadata: { event, path },
    });
  }

  async stop(): Promise<void> {
    for (const watcher of this.watchers) {
      await watcher.close();
    }
    this.watchers = [];
    console.log('All file system watchers stopped');
  }
}
