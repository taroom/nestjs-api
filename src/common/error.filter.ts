import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(ZodError, HttpException)
@Injectable()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.getResponse(),
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      this.logger.info({
        errors: 'Validation error',
        details: exception.errors,
      });

      response.status(400).json({
        statusCode: 400,
        message: exception.errors,
        error: 'Validation Error',
        errors: 'Validation error',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      });
    }
  }
}
