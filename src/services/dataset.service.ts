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

  findPublicById(id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    return this._repository.findPublicById(id, filter);
  }

  findPublic(filter: Filter<Dataset>): Promise<Dataset[]> {
    return this._repository.findPublic(filter);
  }

  countPublic(where?: Where): Promise<number> {
    return this._repository.countPublic(where);
  }

  findAuthenticatedById(accountToken: AccountToken, id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    return this._repository.findAuthenticatedById(accountToken, id, filter);
  }

  findAuthenticated(accountToken: AccountToken, filter: Filter<Dataset>): Promise<Dataset[]> {
    return this._repository.findAuthenticated(accountToken, filter);
  }

  countAuthenticated(accountToken: AccountToken, where?: Where): Promise<number> {
    return this._repository.countAuthenticated(accountToken, where);
  }
}
