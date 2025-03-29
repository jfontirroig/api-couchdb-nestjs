// src/app.module.ts
import { Module } from '@nestjs/common';
import { CouchdbModule } from './couchdb/couchdb.module';

@Module({
  imports: [CouchdbModule],
})
export class AppModule {}
