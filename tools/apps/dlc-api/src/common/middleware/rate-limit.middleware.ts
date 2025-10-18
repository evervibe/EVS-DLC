import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, number>();
  private readonly WINDOW_MS = 60 * 1000; // 1 Minute
  private readonly MAX_REQUESTS = 100;

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const ip = req.ip;
    const now = Date.now();
    const count = this.requests.get(ip) || 0;

    if (count >= this.MAX_REQUESTS) {
      res.status(429).send({ message: 'Too many requests – try again later.' });
      return;
    }

    this.requests.set(ip, count + 1);
    setTimeout(() => this.requests.delete(ip), this.WINDOW_MS);
    next();
  }
}
