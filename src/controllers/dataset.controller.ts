import { inject } from '@loopback/core';
import { Filter, FilterExcludingWhere, Where } from '@loopback/filter';
import { get, getModelSchemaRef, param } from '@loopback/rest';
import { Dataset } from '../models';
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
  async find(@param.query.object('filter') filter?: Filter<Dataset>): Promise<Dataset[]> {
    const results = await this._datasetService.find(filter);
    return results;
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
  async getDataset(@param.path.string('id') id: string, @param.query.object('filter') filter?: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    return this._datasetService.findById(id, filter);
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
  async count(@param.query.object('where') where?: Where<Dataset>): Promise<number> {
    return this._datasetService.count(where);
  }
}
