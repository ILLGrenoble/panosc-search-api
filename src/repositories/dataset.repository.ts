import { inject } from '@loopback/core';
import { Filter, FilterExcludingWhere, Where } from '@loopback/filter';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { TypeORMDataSource } from '../datasources';
import { AccountToken, Dataset, DocumentAcl } from '../models';
import { BaseRepository } from './base.repository';

export class DatasetRepository extends BaseRepository<Dataset, string> {
  constructor(@inject('datasources.typeorm') dataSource: TypeORMDataSource) {
    super(dataSource, Dataset);
  }

  findPublicById(id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    return this.findById(id, filter, this._modifyQueryForPublic);
  }

  findPublic(filter: Filter<Dataset>): Promise<Dataset[]> {
    return this.find(filter, this._modifyQueryForPublic);
  }

  countPublic(where?: Where): Promise<number> {
    return this.count(where, this._modifyQueryForPublic);
  }

  findAuthenticatedById(accountToken: AccountToken, id: string, filter: FilterExcludingWhere<Dataset>): Promise<Dataset> {
    return this.findById(id, filter, this._modifyQueryForAuthenticated(accountToken));
  }

  findAuthenticated(accountToken: AccountToken, filter: Filter<Dataset>): Promise<Dataset[]> {
    return this.find(filter, this._modifyQueryForAuthenticated(accountToken));
  }

  countAuthenticated(accountToken: AccountToken, where?: Where): Promise<number> {
    return this.count(where, this._modifyQueryForAuthenticated(accountToken));
  }

  private _modifyQueryForPublic(queryBuilder: SelectQueryBuilder<Dataset>) {
    queryBuilder.andWhere(`${queryBuilder.alias}.isPublic = true`);
  }

  private _modifyQueryForAuthenticated(accountToken: AccountToken) {
    return (queryBuilder: SelectQueryBuilder<Dataset>) => {
      queryBuilder
        .andWhere(
          new Brackets((qb) => {
            qb
              .where(`${queryBuilder.alias}.isPublic = true`)
              .orWhere(() => {
                const subQuery = queryBuilder.subQuery()
                  .select('__acl.documentid')
                  .from(DocumentAcl, '__acl')
                  .where('__acl.personid = :__aclPersonId', { __aclPersonId: accountToken.id })
                  .getQuery();

                return `${queryBuilder.alias}.documentid IN ${subQuery}`;
            });
          })
        );
    };
  }
}
