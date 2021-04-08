import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import { Instrument } from '../models';
import { InstrumentRepository } from '../repositories';
import { WhereProvider } from './where.provider';

export class InstrumentWhereProvider extends WhereProvider<Instrument, string> {
  constructor(@inject(RestBindings.Http.REQUEST) request: Request, @repository(InstrumentRepository) repository: InstrumentRepository) {
    super(request, repository);
  }
}
