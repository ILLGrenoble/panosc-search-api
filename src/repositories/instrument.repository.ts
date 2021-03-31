import { inject } from '@loopback/core';
import { TypeORMDataSource } from '../datasources';
import { Instrument } from '../models';
import { BaseRepository } from './base.repository';

export class InstrumentRepository extends BaseRepository<Instrument, string> {
  constructor(@inject('datasources.typeorm') dataSource: TypeORMDataSource) {
    super(dataSource, Instrument);
  }
}
