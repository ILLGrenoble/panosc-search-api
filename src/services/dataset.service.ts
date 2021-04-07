import { bind, BindingScope } from '@loopback/core';
import { Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { AccountToken, Dataset } from '../models';
import { DatasetRepository } from '../repositories';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class DatasetService extends BaseService<Dataset, string, DatasetRepository> {
  constructor(@repository(DatasetRepository) repo: DatasetRepository) {
    super(repo);
  }

  async findPublicById(id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    const dataset = await this._repository.findPublicById(id, filter);
    this.injectFiles(dataset);

    return dataset;
  }

  async findPublic(filter: Filter<Dataset>): Promise<Dataset[]> {
    const datasets = await this._repository.findPublic(filter);
    this.injectFiles(datasets);

    return datasets;
  }

  countPublic(where?: Where): Promise<number> {
    return this._repository.countPublic(where);
  }

  async findAuthenticatedById(accountToken: AccountToken, id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    const dataset = await this._repository.findAuthenticatedById(accountToken, id, filter);
    this.injectFiles(dataset);

    return dataset;
  }

  async findAuthenticated(accountToken: AccountToken, filter: Filter<Dataset>): Promise<Dataset[]> {
    const datasets = await this._repository.findAuthenticated(accountToken, filter);
    this.injectFiles(datasets);

    return datasets;
  }

  countAuthenticated(accountToken: AccountToken, where?: Where): Promise<number> {
    return this._repository.countAuthenticated(accountToken, where);
  }

  injectFiles(input: Dataset | Dataset[]) {
    if (Array.isArray(input)) {
      input.forEach((dataset) => dataset.generateFilesIfEmpty());
    } else {
      input.generateFilesIfEmpty();
    }
  }
}
