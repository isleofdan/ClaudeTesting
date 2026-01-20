#!/usr/bin/env node

import { resolve } from 'path';
import { Scheduler } from './core/Scheduler';
import { ConfigParser } from './parsers/ConfigParser';
import { ScheduleHandler } from './triggers/ScheduleHandler';
import { FileSystemHandler } from './triggers/FileSystemHandler';
import { WebhookHandler } from './triggers/WebhookHandler';
import { EventHandler } from './triggers/EventHandler';
import {
  ScheduleTrigger,
  FileSystemTrigger,
  WebhookTrigger,
  EventTrigger,
} from './types';

/**
 * Main application entry point
 */
async function main() {
  // Get config file path from command line or use default
  const configPath = process.argv[2] || resolve(process.cwd(), 'scheduler.yaml');

  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║     Skill Automation Scheduler v1.0.0              ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log();
  console.log(`Loading configuration from: ${configPath}`);

  try {
    // Load configuration
    const config = ConfigParser.loadConfig(configPath);
    const scheduler = new Scheduler(config);

    // Separate triggers by type
    const scheduleTriggers = config.triggers.filter(
      (t): t is ScheduleTrigger => t.type === 'schedule'
    );
    const fileSystemTriggers = config.triggers.filter(
      (t): t is FileSystemTrigger => t.type === 'filesystem'
    );
    const webhookTriggers = config.triggers.filter(
      (t): t is WebhookTrigger => t.type === 'webhook'
    );
    const eventTriggers = config.triggers.filter(
      (t): t is EventTrigger => t.type === 'event'
    );

    // Register handlers
    if (scheduleTriggers.length > 0) {
      scheduler.registerHandler(new ScheduleHandler(scheduler, scheduleTriggers));
    }
    if (fileSystemTriggers.length > 0) {
      scheduler.registerHandler(new FileSystemHandler(scheduler, fileSystemTriggers));
    }
    if (webhookTriggers.length > 0) {
      scheduler.registerHandler(new WebhookHandler(scheduler, webhookTriggers));
    }
    if (eventTriggers.length > 0) {
      scheduler.registerHandler(new EventHandler(scheduler, eventTriggers));
    }

    // Start scheduler
    await scheduler.start();

    console.log();
    console.log('📋 Loaded skills:');
    for (const [name, skill] of Object.entries(config.skills)) {
      console.log(`  - ${name}: ${skill.description || skill.command}`);
    }

    console.log();
    console.log('✅ Scheduler is running. Press Ctrl+C to stop.');
    console.log();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log();
      console.log('Shutting down gracefully...');
      await scheduler.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log();
      console.log('Shutting down gracefully...');
      await scheduler.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the application
if (require.main === module) {
  main();
}

// Export for programmatic use
export { Scheduler } from './core/Scheduler';
export { EventBus } from './core/EventBus';
export { ConfigParser } from './parsers/ConfigParser';
export * from './types';
