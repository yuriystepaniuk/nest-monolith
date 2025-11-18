import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message: string = 'Database error';
    let statusCode: number = 500;

    if (exception.code === 'P2002') {
      message = `Unique constraint failed on fields: ${String(exception.meta?.target)}`;
      statusCode = 400;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
    });
  }
}
