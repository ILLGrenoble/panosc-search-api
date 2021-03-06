import { inject } from '@loopback/core';
import { Filter, Where } from '@loopback/filter';
import { get, getModelSchemaRef, param } from '@loopback/rest';
import { QueryComponent } from '../components';
import { Instrument } from '../models';
import { InstrumentService } from '../services';
import { BaseController } from './base.controller';

export class InstrumentController extends BaseController {
  constructor(@inject('services.InstrumentService') private _instrumentService: InstrumentService) {
    super();
  }

  @get('/instruments', {
    summary: 'Find all instances of the model matched by filter from the data source.',
    tags: ['Instrument'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Instrument) } }
      }
    }
  })
  async find(@inject(QueryComponent.INSTRUMENT_FILTER) filter?: Filter<Instrument>): Promise<Instrument[]> {
    return this._instrumentService.find(filter);
  }

  @get('/instruments/{id}', {
    summary: 'Find a model instance by {{id}} from the data source.',
    tags: ['Instrument'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Instrument) } }
      }
    }
  })
  async getInstrument(@param.path.string('id') id: string, @inject(QueryComponent.INSTRUMENT_FILTER) filter?: Filter<Instrument>): Promise<Instrument> {
    const instrument = await this._instrumentService.findById(id, filter);
    this.throwNotFoundIfNull(instrument);
    return instrument;
  }

  @get('/instruments/count', {
    summary: 'Count instances of the model matched by where from the data source.',
    tags: ['Instrument'],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Instrument) } }
      }
    }
  })
  async count(@inject(QueryComponent.INSTRUMENT_WHERE) where?: Where<Instrument>): Promise<number> {
    return this._instrumentService.count(where);
  }
}
