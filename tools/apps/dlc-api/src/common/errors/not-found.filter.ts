import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify/types/request';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception.getStatus();
    const message = exception.message || 'Resource not found';

    response.status(status).send({
      success: false,
      statusCode: status,
      message,
      errorCode: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
