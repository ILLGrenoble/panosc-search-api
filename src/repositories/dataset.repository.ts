import { inject } from '@loopback/core';
import { TypeORMDataSource } from '../datasources';
import { Dataset } from '../models';
import { BaseRepository } from './base.repository';

export class DatasetRepository extends BaseRepository<Dataset, string> {
  constructor(@inject('datasources.typeorm') dataSource: TypeORMDataSource) {
    super(dataSource, Dataset);
  }
}
