#!/usr/bin/env node

/**
 * Example script to emit custom events to the scheduler
 * Usage: node scripts/example-emit-event.js <event-name> [metadata-json]
 */

const { EventBus } = require('../dist/core/EventBus');

const eventName = process.argv[2];
const metadataJson = process.argv[3];

if (!eventName) {
  console.error('Usage: node scripts/example-emit-event.js <event-name> [metadata-json]');
  process.exit(1);
}

const metadata = metadataJson ? JSON.parse(metadataJson) : undefined;

const eventBus = EventBus.getInstance();
eventBus.emit(eventName, metadata);

console.log(`Event emitted: ${eventName}`);
if (metadata) {
  console.log('Metadata:', JSON.stringify(metadata, null, 2));
}
