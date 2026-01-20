import { EventEmitter } from 'events';

/**
 * Custom event bus for triggering skills
 */
export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(100); // Increase max listeners for multiple triggers
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emit a custom event
   */
  emit(eventName: string, metadata?: Record<string, any>): boolean {
    console.log(`[${new Date().toISOString()}] Event emitted: ${eventName}`);
    return super.emit(eventName, metadata);
  }

  /**
   * Subscribe to an event
   */
  on(eventName: string, listener: (metadata?: Record<string, any>) => void): this {
    return super.on(eventName, listener);
  }

  /**
   * Unsubscribe from an event
   */
  off(eventName: string, listener: (metadata?: Record<string, any>) => void): this {
    return super.off(eventName, listener);
  }
}
