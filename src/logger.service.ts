import { Injectable } from '@nestjs/common';
import { logger } from './logger';  // Importa tu configuración de Winston

@Injectable()
export class LoggerService {

  info(message: string) {
    logger.info(message);
  }

  error(message: string, trace?: string) {
    logger.error(message, trace);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
  }
}
