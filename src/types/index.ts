/**
 * Skill execution context
 */
export interface SkillContext {
  trigger: TriggerType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Skill definition
 */
export interface Skill {
  name: string;
  command: string;
  args?: string[];
  description?: string;
}

/**
 * Trigger types
 */
export type TriggerType = 'schedule' | 'filesystem' | 'webhook' | 'event';

/**
 * Base trigger interface
 */
export interface BaseTrigger {
  type: TriggerType;
  skills: string[];
  enabled?: boolean;
}

/**
 * Schedule-based trigger (cron)
 */
export interface ScheduleTrigger extends BaseTrigger {
  type: 'schedule';
  cron: string;
}

/**
 * File system event trigger
 */
export interface FileSystemTrigger extends BaseTrigger {
  type: 'filesystem';
  watch: string | string[];
  events?: ('add' | 'change' | 'unlink')[];
  pattern?: string;
}

/**
 * HTTP webhook trigger
 */
export interface WebhookTrigger extends BaseTrigger {
  type: 'webhook';
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  secret?: string;
}

/**
 * Custom event trigger
 */
export interface EventTrigger extends BaseTrigger {
  type: 'event';
  eventName: string;
}

/**
 * Union of all trigger types
 */
export type Trigger = ScheduleTrigger | FileSystemTrigger | WebhookTrigger | EventTrigger;

/**
 * Configuration file structure
 */
export interface SchedulerConfig {
  skills: Record<string, Skill>;
  triggers: Trigger[];
  settings?: {
    webhookPort?: number;
    webhookHost?: string;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
  };
}

/**
 * Skill executor function type
 */
export type SkillExecutor = (skill: Skill, context: SkillContext) => Promise<void>;

/**
 * Trigger handler interface
 */
export interface TriggerHandler {
  start(): Promise<void>;
  stop(): Promise<void>;
}
