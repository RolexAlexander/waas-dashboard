import { Mail } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class MailSystem {
  private agents: Map<string, (mail: Mail) => void> = new Map();
  private onMailSent: (mail: Mail) => void;

  constructor(onMailSent: (mail: Mail) => void) {
    this.onMailSent = onMailSent;
  }

  register(agentName: string, handler: (mail: Mail) => void) {
    this.agents.set(agentName, handler);
  }

  send(to: string, mailData: { from: string; subject: string; body: any }) {
    const mail: Mail = {
      id: uuidv4(),
      ...mailData,
      to,
      timestamp: Date.now(),
    };

    this.onMailSent(mail);

    const handler = this.agents.get(to);
    if (handler) {
      handler(mail);
    } else {
      console.warn(`[MailSystem] No handler registered for agent: ${to}`);
    }
  }

  reset() {
    this.agents.clear();
  }
}