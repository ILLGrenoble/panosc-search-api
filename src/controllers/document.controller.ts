import { inject } from '@loopback/core';
import { get, getModelSchemaRef, param } from '@loopback/rest';
import { Document } from '../models';
import { DocumentService } from '../services';
import { BaseController } from './base.controller';

export class DocumentController extends BaseController {
  constructor(@inject('services.DocumentService') private _documentService: DocumentService) {
    super();
  }

  @get('/documents/{id}', {
    summary: 'Gets an document',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Document) } }
      }
    }
  })
  async getDocument(@param.path.string('id') id: string): Promise<Document> {
    return this._documentService.getById(id);
  }
}
