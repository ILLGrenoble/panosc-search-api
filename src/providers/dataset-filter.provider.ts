import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import { Dataset } from '../models';
import { DatasetRepository } from '../repositories';
import { FilterProvider } from './filter.provider';

export class DatasetFilterProvider extends FilterProvider<Dataset, string> {
  constructor(@inject(RestBindings.Http.REQUEST) request: Request, @repository(DatasetRepository) repository: DatasetRepository) {
    super(request, repository);
  }
}
