# Skill Automation Scheduler

A powerful, flexible automation scheduler that can run specific skills (commands) in sequence based on time schedules or external triggers. Built with TypeScript and Node.js.

## Features

- **Time-Based Scheduling**: Execute skills on cron schedules
- **File System Triggers**: Monitor directories and trigger skills on file changes
- **HTTP Webhooks**: Receive webhooks from external services to trigger skills
- **Custom Event Bus**: Programmatically emit events to trigger skills
- **YAML Configuration**: Easy-to-read and version-controllable configuration
- **Sequential Execution**: Skills execute in sequence for reliable workflows
- **TypeScript**: Fully typed for better developer experience

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd ClaudeTesting

# Install dependencies
npm install

# Build the project
npm run build
```

## Quick Start

1. Create a configuration file `scheduler.yaml` (or copy from examples):

```yaml
skills:
  hello:
    command: echo
    args: ["Hello World!"]
    description: Simple hello world

triggers:
  - type: schedule
    cron: "*/5 * * * *"  # Every 5 minutes
    skills: [hello]
```

2. Run the scheduler:

```bash
npm start

# Or with a custom config file
npm start path/to/config.yaml
```

## Configuration

### Skills

Skills are commands that the scheduler can execute. Define them in the `skills` section:

```yaml
skills:
  skill_name:
    command: "command-to-run"
    args: ["arg1", "arg2"]  # Optional
    description: "What this skill does"  # Optional
```

**Example:**

```yaml
skills:
  build:
    command: npm
    args: ["run", "build"]
    description: Build the project

  test:
    command: npm
    args: ["test"]
    description: Run tests
```

### Triggers

Triggers define when and how skills are executed. There are four types:

#### 1. Schedule Triggers

Execute skills on a cron schedule.

```yaml
triggers:
  - type: schedule
    cron: "0 2 * * *"  # Daily at 2 AM
    skills: [backup, cleanup]
    enabled: true  # Optional, defaults to true
```

**Cron Syntax:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, both 0 and 7 are Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

**Common patterns:**
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour
- `0 9 * * 1-5` - 9 AM on weekdays
- `0 0 * * 0` - Midnight on Sundays

#### 2. File System Triggers

Monitor files/directories and execute skills when changes occur.

```yaml
triggers:
  - type: filesystem
    watch: "./src"  # Single path
    events: [change]  # add, change, unlink
    skills: [build, test]

  - type: filesystem
    watch: ["./config", "./data"]  # Multiple paths
    events: [add, change]
    pattern: "*.json"  # Optional glob pattern
    skills: [reload]
```

**Events:**
- `add` - File created
- `change` - File modified
- `unlink` - File deleted

#### 3. Webhook Triggers

Trigger skills via HTTP requests.

```yaml
triggers:
  - type: webhook
    path: /deploy
    method: POST  # GET, POST, PUT, DELETE
    secret: "your-secret-key"  # Optional authentication
    skills: [test, build, deploy]
```

**Calling a webhook:**

```bash
# Without secret
curl -X POST http://localhost:3000/deploy

# With secret (via header)
curl -X POST http://localhost:3000/deploy \
  -H "x-webhook-secret: your-secret-key"

# With secret (via query param)
curl -X POST http://localhost:3000/deploy?secret=your-secret-key
```

#### 4. Event Triggers

Listen for custom events on the internal event bus.

```yaml
triggers:
  - type: event
    eventName: user.signup
    skills: [send_welcome_email, create_workspace]
```

**Emitting events programmatically:**

```typescript
import { EventBus } from './core/EventBus';

const eventBus = EventBus.getInstance();

// Emit an event
eventBus.emit('user.signup', {
  userId: '123',
  email: 'user@example.com'
});
```

### Settings

Global configuration settings:

```yaml
settings:
  webhookPort: 3000        # Port for webhook server
  webhookHost: localhost   # Host for webhook server
  logLevel: info          # debug, info, warn, error
```

## Example Configurations

The `configs/examples/` directory contains complete examples:

- **basic.yaml** - Simple scheduled tasks
- **development.yaml** - Auto-build and test workflow
- **ci-cd.yaml** - Webhook-driven CI/CD pipeline
- **monitoring.yaml** - System health checks and backups
- **event-driven.yaml** - Custom event bus usage

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode (with ts-node)
npm run dev

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build artifacts
npm run clean
```

## Project Structure

```
skill-automation-scheduler/
├── src/
│   ├── core/              # Core scheduler components
│   │   ├── Scheduler.ts   # Main scheduler orchestrator
│   │   ├── SkillExecutor.ts  # Executes skills
│   │   └── EventBus.ts    # Custom event system
│   ├── triggers/          # Trigger handlers
│   │   ├── ScheduleHandler.ts     # Cron scheduling
│   │   ├── FileSystemHandler.ts   # File watching
│   │   ├── WebhookHandler.ts      # HTTP webhooks
│   │   └── EventHandler.ts        # Event bus
│   ├── parsers/           # Configuration parsers
│   │   └── ConfigParser.ts        # YAML parser
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts           # Application entry point
├── configs/
│   └── examples/          # Example configurations
├── dist/                  # Compiled JavaScript
├── scheduler.yaml         # Default configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Use Cases

### Automated Development Workflow

Monitor source files and automatically run linting, tests, and builds:

```yaml
skills:
  lint: { command: npm, args: ["run", "lint"] }
  test: { command: npm, args: ["test"] }
  build: { command: npm, args: ["run", "build"] }

triggers:
  - type: filesystem
    watch: "./src"
    events: [change]
    skills: [lint, test, build]
```

### CI/CD Pipeline

Deploy on webhook triggers from GitHub:

```yaml
skills:
  deploy_staging: { command: ./deploy-staging.sh }
  deploy_production: { command: ./deploy-production.sh }

triggers:
  - type: webhook
    path: /deploy/staging
    method: POST
    secret: "${GITHUB_SECRET}"
    skills: [deploy_staging]

  - type: webhook
    path: /deploy/production
    method: POST
    secret: "${GITHUB_SECRET}"
    skills: [deploy_production]
```

### Scheduled Maintenance

Run backups and cleanups on a schedule:

```yaml
skills:
  backup: { command: ./backup.sh }
  cleanup: { command: ./cleanup.sh }

triggers:
  - type: schedule
    cron: "0 2 * * *"  # 2 AM daily
    skills: [backup, cleanup]
```

### Event-Driven Automation

Trigger workflows based on application events:

```yaml
skills:
  send_email: { command: node, args: ["./send-email.js"] }
  update_db: { command: node, args: ["./update-db.js"] }

triggers:
  - type: event
    eventName: user.created
    skills: [send_email, update_db]
```

## Programmatic Usage

You can also use the scheduler programmatically:

```typescript
import { Scheduler, EventBus } from 'skill-automation-scheduler';
import { ConfigParser } from 'skill-automation-scheduler';

// Load configuration
const config = ConfigParser.loadConfig('./scheduler.yaml');

// Create scheduler
const scheduler = new Scheduler(config);

// Start scheduler
await scheduler.start();

// Emit custom events
const eventBus = EventBus.getInstance();
eventBus.emit('deployment.success', { version: '1.0.0' });

// Stop scheduler
await scheduler.stop();
```

## Security Considerations

- **Webhook Secrets**: Always use webhook secrets in production
- **Command Injection**: Be careful with user-provided input in commands
- **File Permissions**: Ensure the scheduler has appropriate file system permissions
- **Network Exposure**: Bind webhook server to localhost in development

## Troubleshooting

### Scheduler won't start

- Check that the configuration file exists and is valid YAML
- Ensure all required fields are present in the configuration
- Check for syntax errors in cron expressions

### Skills not executing

- Verify the command exists and is in your PATH
- Check file permissions for scripts
- Review logs for error messages
- Ensure skills are enabled (`enabled: true`)

### Webhooks not working

- Verify the webhook server is running (check logs)
- Ensure the correct port and host are configured
- Check firewall settings if accessing remotely
- Verify webhook secret matches if configured

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
