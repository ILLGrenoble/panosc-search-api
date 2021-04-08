import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import { Instrument } from '../models';
import { InstrumentRepository } from '../repositories';
import { FilterProvider } from './filter.provider';

export class InstrumentFilterProvider extends FilterProvider<Instrument, string> {
  constructor(@inject(RestBindings.Http.REQUEST) request: Request, @repository(InstrumentRepository) repository: InstrumentRepository) {
    super(request, repository);
  }
}
