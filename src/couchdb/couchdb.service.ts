import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Nano from 'nano';
import { LoggerService } from '../logger.service';

@Injectable()
export class CouchdbService implements OnModuleInit {
  private nano: Nano.ServerScope;
  private db: Nano.DocumentScope<any>;
  private readonly logger = new Logger(CouchdbService.name);
  private readonly dbName = 'ubid';

  constructor(private readonly loggerService: LoggerService) {
    const couchdbUrl = 'http://admin:bahai080261@190.113.12.48:5984';
    this.nano = Nano(couchdbUrl);
  }

  async onModuleInit() {
    await this.initDatabase(this.dbName);
    this.db = this.nano.db.use(this.dbName);
    this.logger.log(`Base de datos "${this.dbName}" lista para usarse.`);
  }

  async initDatabase(dbName: string): Promise<void> {
    try {
      await this.nano.db.get(dbName);
      this.logger.log(`La base de datos "${dbName}" ya existe.`);
    } catch (error) {
      if (error.statusCode === 404) {
        await this.nano.db.create(dbName);
        this.logger.log(`La base de datos "${dbName}" ha sido creada.`);
      } else {
        throw error;
      }
    }
  }

  async createDocument(doc: any) {
    return await this.db.insert(doc);
  }

  async getDocument(id: string) {
    return await this.db.get(id);
  }

  async updateDocument(doc: any) {
    return await this.db.insert(doc);
  }

  async deleteDocument(id: string, rev: string) {
    return await this.db.destroy(id, rev);
  }

  async getAllDocuments() {
    return await this.db.list({ include_docs: true });
  }

  // Método para crear un índice (Mango Queries)
  async createIndex(indexData: any) {
     return await this.db.createIndex(indexData);
  }

  // Método para buscar documentos usando Mango Queries
  async findDocuments(query: any) {
    return await this.db.find(query);
  }
}
