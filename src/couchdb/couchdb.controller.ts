// src/couchdb/couchdb.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CouchdbService } from './couchdb.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../logger.service';

@Controller('api-couchdb')
export class CouchdbController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly couchdbService: CouchdbService,
  ) {}

  // Endpoint para crear un documento
  @Post('create')
  //@UseGuards(JwtAuthGuard)
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    const result = await this.couchdbService.createDocument(createDocumentDto);
    this.loggerService.info(`Documento creado exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para obtener un documento por id
  @Get('get/:id')
  //@UseGuards(JwtAuthGuard)
  async get(@Param('id') id: string) {
    const result = await this.couchdbService.getDocument(id);
    this.loggerService.info(`Documento obtenido: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para obtener todos los documentos
  @Get('getall')
  //@UseGuards(JwtAuthGuard)
  async getAll() {
      const result = await this.couchdbService.getAllDocuments();
    this.loggerService.info(`Documentos obtenidos: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para actualizar un documento
  @Put('put')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body() updateDocumentDto: UpdateDocumentDto) {
    const result = await this.couchdbService.updateDocument(updateDocumentDto);
    this.loggerService.info(`Documento actualizado exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para eliminar un documento
  @Delete('delete/:id')
  //@UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Query('rev') rev: string) {
    const result = await this.couchdbService.deleteDocument(id, rev);
    this.loggerService.info(`Documento eliminado exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para crear un índice (campo subdomain) usando Mango Queries
  @Post('_index_subdomain')
  async createIndexSubdomain(@Body() indexData: any) {
    const result = await this.couchdbService.createIndex(indexData);
    this.loggerService.info(`Índice creado exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para crear un índice (campo owner) usando Mango Queries
  @Post('_index_owner')
  async createIndexOwner(@Body() indexData: any) {
    const result = await this.couchdbService.createIndex(indexData);
    this.loggerService.info(`Índice creado exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  // Endpoint para buscar documentos usando Mango Queries
  @Post('_find')
  async findDocuments(@Body() query: any) {
    const result = await this.couchdbService.findDocuments(query);
    this.loggerService.info(`Consulta realizada exitosamente: ${JSON.stringify(result)}`);
    return result;
  }
}
