import express, { Express, Request, Response } from 'express';
import { WebhookTrigger, TriggerHandler } from '../types';
import { Scheduler } from '../core/Scheduler';
import { Server } from 'http';

/**
 * Handles HTTP webhook triggers
 */
export class WebhookHandler implements TriggerHandler {
  private scheduler: Scheduler;
  private triggers: WebhookTrigger[];
  private app: Express;
  private server?: Server;
  private port: number;
  private host: string;

  constructor(scheduler: Scheduler, triggers: WebhookTrigger[]) {
    this.scheduler = scheduler;
    this.triggers = triggers;
    this.app = express();

    const config = scheduler.getConfig();
    this.port = config.settings?.webhookPort || 3000;
    this.host = config.settings?.webhookHost || 'localhost';

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  async start(): Promise<void> {
    // Register routes for each webhook trigger
    for (const trigger of this.triggers) {
      if (trigger.enabled === false) {
        console.log(`Webhook trigger disabled, skipping: ${trigger.path}`);
        continue;
      }

      const method = (trigger.method || 'POST').toLowerCase();
      const handler = this.createHandler(trigger);

      switch (method) {
        case 'get':
          this.app.get(trigger.path, handler);
          break;
        case 'post':
          this.app.post(trigger.path, handler);
          break;
        case 'put':
          this.app.put(trigger.path, handler);
          break;
        case 'delete':
          this.app.delete(trigger.path, handler);
          break;
      }

      console.log(`Webhook registered: ${method.toUpperCase()} ${trigger.path} -> [${trigger.skills.join(', ')}]`);
    }

    // Start server
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, this.host, () => {
        console.log(`Webhook server listening on http://${this.host}:${this.port}`);
        resolve();
      });
    });
  }

  private createHandler(trigger: WebhookTrigger) {
    return async (req: Request, res: Response) => {
      console.log(`[${new Date().toISOString()}] Webhook received: ${req.method} ${req.path}`);

      // Validate secret if configured
      if (trigger.secret) {
        const providedSecret = req.headers['x-webhook-secret'] || req.query.secret;
        if (providedSecret !== trigger.secret) {
          console.error('Invalid webhook secret');
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
      }

      // Execute skills asynchronously
      this.scheduler.executeSkills(trigger.skills, {
        trigger: 'webhook',
        timestamp: new Date(),
        metadata: {
          method: req.method,
          path: req.path,
          body: req.body,
          query: req.query,
          headers: req.headers,
        },
      }).catch((error) => {
        console.error('Error executing webhook skills:', error);
      });

      // Respond immediately
      res.status(200).json({
        status: 'accepted',
        message: 'Skills triggered successfully',
        skills: trigger.skills,
      });
    };
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          console.log('Webhook server stopped');
          resolve();
        });
      });
    }
  }
}
