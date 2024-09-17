import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

const logger = new Logger('DatabaseExceptionHandler');

export function handleDBExceptions(error: any) {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }

  logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
}
