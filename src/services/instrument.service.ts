import { bind, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Instrument } from '../models';
import { InstrumentRepository } from '../repositories';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class InstrumentService extends BaseService<Instrument, string, InstrumentRepository> {
  constructor(@repository(InstrumentRepository) repo: InstrumentRepository) {
    super(repo);
  }
}
