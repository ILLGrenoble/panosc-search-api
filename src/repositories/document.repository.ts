import { inject } from '@loopback/core';
import { TypeORMDataSource } from '../datasources';
import { Document } from '../models';
import { BaseRepository } from './base.repository';

export class DocumentRepository extends BaseRepository<Document, string> {
  constructor(@inject('datasources.typeorm') dataSource: TypeORMDataSource) {
    super(dataSource, Document);
  }
}
