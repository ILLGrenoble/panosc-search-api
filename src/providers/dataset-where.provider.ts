import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import { Dataset } from '../models';
import { DatasetRepository } from '../repositories';
import { WhereProvider } from './where.provider';

export class DatasetWhereProvider extends WhereProvider<Dataset, string> {
  constructor(@inject(RestBindings.Http.REQUEST) request: Request, @repository(DatasetRepository) repository: DatasetRepository) {
    super(request, repository);
  }
}
