import { inject } from '@loopback/core';
import { Filter, FilterExcludingWhere, Where } from '@loopback/filter';
import { get, getModelSchemaRef, param } from '@loopback/rest';
import { AuthenticationComponent } from '../components';
import { AccountToken, Dataset } from '../models';
import { DatasetService } from '../services';
import { BaseController } from './base.controller';

export class DatasetController extends BaseController {
  constructor(@inject('services.DatasetService') private _datasetService: DatasetService) {
    super();
  }

  @get('/datasets', {
    summary: 'Find all instances of the model matched by filter from the data source.',
    tags: ['Dataset'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Dataset) } }
      }
    }
  })
  async find(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @param.query.object('filter') filter?: Filter<Dataset>): Promise<Dataset[]> {
    if (accountToken) {
      return this._datasetService.findAuthenticated(accountToken, filter);
    } else {
      return this._datasetService.findPublic(filter);
    }
  }

  @get('/datasets/{id}', {
    summary: 'Find a model instance by {{id}} from the data source.',
    tags: ['Dataset'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Dataset) } }
      }
    }
  })
  async getDataset(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @param.path.string('id') id: string, @param.query.object('filter') filter?: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    if (accountToken) {
      return this._datasetService.findAuthenticatedById(accountToken, id, filter);
    } else {
      return this._datasetService.findPublicById(id, filter);
    }
  }

  @get('/datasets/count', {
    summary: 'Count instances of the model matched by where from the data source.',
    tags: ['Dataset'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Dataset) } }
      }
    }
  })
  async count(@inject(AuthenticationComponent.ACCOUNT_TOKEN) accountToken: AccountToken, @param.query.object('where') where?: Where<Dataset>): Promise<number> {
    if (accountToken) {
      return this._datasetService.countAuthenticated(accountToken, where);
    } else {
      return this._datasetService.countPublic(where);
    }
  } 
}
