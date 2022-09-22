import {inject} from '@loopback/core';
import {Filter, Where} from '@loopback/filter';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {APPLICATION_CONFIG} from '../application-config';
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
    if (accountToken) {
      return this._documentService.findAuthenticated(accountToken, filter);
    }

    const scoringEnabled = APPLICATION_CONFIG().scoring.url !== '' && APPLICATION_CONFIG().scoring.url != null;
    if (scoringEnabled && filter) {
      // Remove limit and offset/skip ... this has to be done after the scoring is applied... Yep that means we have to extract all the documents from the db :rolling_eyes:
      const limit = filter.limit || -1;
      const offset = filter.offset ? filter.offset : filter.skip ? filter.skip : -1;

      delete filter.limit;
      delete filter.offset;
      delete filter.skip;

      // Get documents from DB
      let documents = await this._documentService.findPublic(filter);

      const query = (filter as any).query;
      if (query) {
        // Initialise all scores to 0
        documents.forEach(document => document.score = 0)

        // Get scores and add them to the result
        await this._scoringService.score(documents, query);

        // Filter out all results with scores of 0
        documents = documents.filter(document => document.score > 0);

        // Sort by score desc
        documents.sort((a, b) => a.score < b.score ? 1 : -1);
      }

      // Apply limit and offset if they were included in the original filter
      if (documents.length > 0) {
        if (offset >= 0 && limit >= 0) {
          documents = documents.slice(Math.min(offset, documents.length - 1), Math.min(offset + limit, documents.length));

        } else if (offset >= 0) {
          documents = documents.slice(Math.min(offset, documents.length - 1));

        } else if (limit >= 0) {
          documents = documents.slice(0, Math.min(limit, documents.length));
        }
      }

      return documents;

    } else {
      return this._documentService.findPublic(filter);
    }
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
