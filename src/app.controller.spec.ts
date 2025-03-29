// src/couchdb/couchdb.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CouchdbController } from './couchdb.controller';
import { CouchdbService } from './couchdb.service';
import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('CouchdbController', () => {
  let controller: CouchdbController;
  let service: CouchdbService;

  // Se define un mock para simular el servicio de CouchDB
  const mockCouchdbService = {
    createDocument: jest.fn((doc) => Promise.resolve({ ok: true, id: '1', rev: '1' })),
    getDocument: jest.fn((id) => Promise.resolve({ _id: id, name: 'Test' })),
    getAllDocuments: jest.fn(() => Promise.resolve({ rows: [{ doc: { _id: '1', name: 'Test' } }] })),
    updateDocument: jest.fn((doc) => Promise.resolve({ ok: true, id: doc._id, rev: '2' })),
    deleteDocument: jest.fn((id, rev) => Promise.resolve({ ok: true, id, rev })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouchdbController],
      providers: [
        {
          provide: CouchdbService,
          useValue: mockCouchdbService,
        },
      ],
    }).compile();

    controller = module.get<CouchdbController>(CouchdbController);
    service = module.get<CouchdbService>(CouchdbService);
  });

  it('debe estar definido el controlador', () => {
    expect(controller).toBeDefined();
  });

  describe('Operaciones CRUD', () => {
    it('debe crear un documento', async () => {
      const dto = { name: 'Documento de prueba' };
      const result = await controller.create(dto);
      expect(result).toEqual({ ok: true, id: '1', rev: '1' });
      expect(service.createDocument).toHaveBeenCalledWith(dto);
    });

    it('debe retornar un documento por su id', async () => {
      const result = await controller.get('1');
      expect(result).toEqual({ _id: '1', name: 'Test' });
      expect(service.getDocument).toHaveBeenCalledWith('1');
    });

    it('debe retornar todos los documentos', async () => {
      const result = await controller.getAll();
      expect(result).toEqual({ rows: [{ doc: { _id: '1', name: 'Test' } }] });
      expect(service.getAllDocuments).toHaveBeenCalled();
    });

    it('debe actualizar un documento', async () => {
      const dto = { _id: '1', name: 'Documento actualizado', _rev: '1' };
      const result = await controller.update(dto);
      expect(result).toEqual({ ok: true, id: '1', rev: '2' });
      expect(service.updateDocument).toHaveBeenCalledWith(dto);
    });

    it('debe eliminar un documento', async () => {
      const result = await controller.delete('1', '1');
      expect(result).toEqual({ ok: true, id: '1', rev: '1' });
      expect(service.deleteDocument).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('Manejo de Errores', () => {
    it('debe manejar errores en la creación', async () => {
      mockCouchdbService.createDocument.mockRejectedValueOnce(new Error('Error creando documento'));
      await expect(controller.create({ name: 'Test Error' })).rejects.toThrow('Error creando documento');
    });

    it('debe manejar errores en la obtención de un documento', async () => {
      mockCouchdbService.getDocument.mockRejectedValueOnce(new Error('Documento no encontrado'));
      await expect(controller.get('non-existent-id')).rejects.toThrow('Documento no encontrado');
    });

    it('debe manejar errores en la actualización', async () => {
      mockCouchdbService.updateDocument.mockRejectedValueOnce(new Error('Error al actualizar'));
      await expect(controller.update({ _id: '1', name: 'Test', _rev: '1' })).rejects.toThrow('Error al actualizar');
    });

    it('debe manejar errores en la eliminación', async () => {
      mockCouchdbService.deleteDocument.mockRejectedValueOnce(new Error('Error al eliminar'));
      await expect(controller.delete('1', '1')).rejects.toThrow('Error al eliminar');
    });
  });

  describe('Validación de DTOs', () => {
    // Se instancia un pipe de validación para simular la transformación de datos
    const validationPipe = new ValidationPipe({ transform: true });

    it('debe fallar la validación de CreateDocumentDto con datos inválidos', async () => {
      const invalidData = { name: '' }; // El campo name no puede estar vacío
      const dto = plainToInstance(CreateDocumentDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debe pasar la validación de CreateDocumentDto con datos válidos', async () => {
      const validData = { name: 'Documento válido' };
      const dto = plainToInstance(CreateDocumentDto, validData);
      const errors = await validate(dto);
      expect(errors.length).toEqual(0);
    });

    it('debe fallar la validación de UpdateDocumentDto con datos inválidos', async () => {
      const invalidData = { _id: '', name: '', _rev: '' };
      const dto = plainToInstance(UpdateDocumentDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debe pasar la validación de UpdateDocumentDto con datos válidos', async () => {
      const validData = { _id: '1', name: 'Actualizado', _rev: '1' };
      const dto = plainToInstance(UpdateDocumentDto, validData);
      const errors = await validate(dto);
      expect(errors.length).toEqual(0);
    });
  });
});
