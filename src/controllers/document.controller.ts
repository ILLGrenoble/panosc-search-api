import { inject } from '@loopback/core';
import { Filter, FilterExcludingWhere, Where } from '@loopback/filter';
import { get, getModelSchemaRef, param } from '@loopback/rest';
import { Document } from '../models';
import { DocumentService } from '../services';
import { BaseController } from './base.controller';

export class DocumentController extends BaseController {
  constructor(@inject('services.DocumentService') private _documentService: DocumentService) {
    super();
  }

  @get('/documents', {
    summary: 'Find all instances of the model matched by filter from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Document) } }
      }
    }
  })
  async find(@param.query.object('filter') filter?: Filter<Document>): Promise<Document[]> {
    return this._documentService.find(filter);
  }

  @get('/documents/{id}', {
    summary: 'Find a model instance by {{id}} from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Document) } }
      }
    }
  })
  async getDocument(@param.path.string('id') id: string, @param.query.object('filter') filter?: FilterExcludingWhere<Document>): Promise<Document> {
    return this._documentService.findById(id, filter);
  }

  @get('/documents/count', {
    summary: 'Count instances of the model matched by where from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Document) } }
      }
    }
  })
  async count(@param.query.object('where') where?: Where<Document>): Promise<number> {
    return this._documentService.count(where);
  }
}
