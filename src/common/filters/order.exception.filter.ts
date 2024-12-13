import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse?.message || 'An unexpected error occurred';

    const error =
      status === HttpStatus.BAD_REQUEST
        ? 'Bad Request'
        : status === HttpStatus.UNAUTHORIZED
          ? 'Unauthorized'
          : status === HttpStatus.FORBIDDEN
            ? 'Forbidden'
            : status === HttpStatus.NOT_FOUND
              ? 'Not Found'
              : 'Internal Server Error';

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
