import { bind, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Dataset } from '../models';
import { DatasetRepository } from '../repositories';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class DatasetService extends BaseService<Dataset, string, DatasetRepository> {
  constructor(@repository(DatasetRepository) repo: DatasetRepository) {
    super(repo);
  }
}
