import { readFileSync } from 'fs';
import YAML from 'yaml';
import { SchedulerConfig } from '../types';

/**
 * Parses YAML configuration files
 */
export class ConfigParser {
  /**
   * Load and parse a YAML configuration file
   */
  static loadConfig(filePath: string): SchedulerConfig {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const config = YAML.parse(fileContent) as SchedulerConfig;

      // Validate configuration
      this.validateConfig(config);

      return config;
    } catch (error) {
      throw new Error(`Failed to load configuration from ${filePath}: ${error}`);
    }
  }

  /**
   * Validate configuration structure
   */
  private static validateConfig(config: SchedulerConfig): void {
    if (!config.skills || typeof config.skills !== 'object') {
      throw new Error('Configuration must include a "skills" object');
    }

    if (!config.triggers || !Array.isArray(config.triggers)) {
      throw new Error('Configuration must include a "triggers" array');
    }

    // Validate each skill
    for (const [name, skill] of Object.entries(config.skills)) {
      if (!skill.command) {
        throw new Error(`Skill "${name}" must have a "command" property`);
      }
    }

    // Validate each trigger
    for (const trigger of config.triggers) {
      if (!trigger.type) {
        throw new Error('Each trigger must have a "type" property');
      }

      if (!trigger.skills || !Array.isArray(trigger.skills) || trigger.skills.length === 0) {
        throw new Error('Each trigger must have a "skills" array with at least one skill');
      }

      // Validate trigger-specific properties
      switch (trigger.type) {
        case 'schedule':
          if (!('cron' in trigger) || !trigger.cron) {
            throw new Error('Schedule triggers must have a "cron" property');
          }
          break;
        case 'filesystem':
          if (!('watch' in trigger) || !trigger.watch) {
            throw new Error('File system triggers must have a "watch" property');
          }
          break;
        case 'webhook':
          if (!('path' in trigger) || !trigger.path) {
            throw new Error('Webhook triggers must have a "path" property');
          }
          break;
        case 'event':
          if (!('eventName' in trigger) || !trigger.eventName) {
            throw new Error('Event triggers must have an "eventName" property');
          }
          break;
        default:
          throw new Error(`Unknown trigger type: ${trigger.type}`);
      }
    }
  }
}
