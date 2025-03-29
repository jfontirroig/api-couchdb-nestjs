// src/couchdb/couchdb.module.ts
import { Module } from '@nestjs/common';
import { CouchdbController } from './couchdb.controller';
import { CouchdbService } from './couchdb.service';
import { LoggerService } from '../logger.service';  // Tu LoggerService


@Module({
  controllers: [CouchdbController],
  providers: [CouchdbService, LoggerService],
})
export class CouchdbModule {}
