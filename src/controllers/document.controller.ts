import {inject} from '@loopback/core';
import {Filter, Where} from '@loopback/filter';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {AuthenticationComponent, QueryComponent} from '../components';
import {AccountToken, Document} from '../models';
import {DocumentService, ScoringService} from '../services';
import {BaseController} from './base.controller';

export class DocumentController extends BaseController {
  constructor(@inject('services.DocumentService') private _documentService: DocumentService, @inject('services.ScoringService') private _scoringService: ScoringService) {
    super();
  }

  @get('/documents', {
    summary: 'Find all instances of the model matched by filter from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: {'application/json': {schema: getModelSchemaRef(Document)}}
      }
    }
  })
  async find(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @inject(QueryComponent.DOCUMENT_FILTER) filter?: Filter<Document>): Promise<Document[]> {
    let result: Promise<Document[]>;
    if (accountToken) {
      result = this._documentService.findAuthenticated(accountToken, filter);
    } else {
      result = this._documentService.findPublic(filter);
      (await result).forEach(x => x.score = 0)
      await this._scoringService.score(result, filter.query);
      (await result).sort((a, b) => a.score < b.score ? 1 : -1);
    }
    return result;
  }

  @get('/documents/{id}', {
    summary: 'Find a model instance by {{id}} from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: {'application/json': {schema: getModelSchemaRef(Document)}}
      }
    }
  })
  async getDocument(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @param.path.string('id') id: string, @inject(QueryComponent.DOCUMENT_FILTER) filter?: Filter<Document>): Promise<Document> {
    if (accountToken) {
      const document = await this._documentService.findAuthenticatedById(accountToken, id, filter);
      this.throwNotFoundIfNull(document);
      return document;
    } else {
      const document = await this._documentService.findPublicById(id, filter);
      this.throwNotFoundIfNull(document);
      return document;
    }
  }

  @get('/documents/count', {
    summary: 'Count instances of the model matched by where from the data source.',
    tags: ['Document'],
    responses: {
      '200': {
        description: 'Ok',
        content: {'application/json': {schema: getModelSchemaRef(Document)}}
      }
    }
  })
  async count(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @inject(QueryComponent.DOCUMENT_WHERE) where?: Where<Document>): Promise<number> {
    if (accountToken) {
      return this._documentService.countAuthenticated(accountToken, where);
    } else {
      return this._documentService.countPublic(where);
    }
  }
}
