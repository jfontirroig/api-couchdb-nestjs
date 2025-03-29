import * as winston from 'winston';
import { format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

// Winston Logger configuration
export const logger: winston.Logger = winston.createLogger({
    level: 'info',  // Nivel de logging establecido en 'info'
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          format.colorize(),
          format.simple(),
        ),
      }),
      new winston.transports.File({
        filename: 'combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      new DailyRotateFile({
        dirname: 'logs',
        filename: 'nest-couchdb-session-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
});
