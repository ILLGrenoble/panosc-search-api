import { FilterExcludingWhere, Where } from '@loopback/filter';
import { SelectQueryBuilder } from 'typeorm';
import { logger } from '../utils';
import { FilterConverter } from './converter/filter-converter';
import { FindManyQueryOptions, RelationOptions } from './converter/query-options';
import { WhereConverter } from './converter/where-converter';

export class QueryExecutor<ID, T extends {}> {
  constructor(private _builder: (alias: string) => SelectQueryBuilder<T>) {}

  async findOne(id: ID, alias: string, filter?: FilterExcludingWhere<T>): Promise<T> {
    const queryBuilder = this._builder(alias);

    const options = new FilterConverter<T>().convertFindOneFilter(alias, {}, filter);

    if (options) {
      this._constructInnerJoins(options.relationOptions, queryBuilder);
      this._constructWhereClauses(options, queryBuilder);
      this._constructOrderBy(options, queryBuilder);
    }

    const result = await queryBuilder.andWhereInIds(id).getOne();
    return result;
  }

  async findMany(alias: string, filter?: FilterExcludingWhere<T>): Promise<T[]> {
    const queryBuilder = this._builder(alias);

    const options = new FilterConverter<T>().convertFindManyFilter(alias, {}, filter);

    if (options) {
      this._constructInnerJoins(options.relationOptions, queryBuilder);
      this._constructWhereClauses(options, queryBuilder);
      this._constructOrderBy(options, queryBuilder);

      if (options.limit) {
        queryBuilder.limit(options.limit);
      }
      if (options.offset) {
        queryBuilder.offset(options.offset);
      }
    }

    const result = await queryBuilder.getMany();
    return result;
  }

  async count(alias: string, where?: Where): Promise<number> {
    const queryBuilder = this._builder(alias);

    const whereQueryOptions = new WhereConverter().convert(alias, where);
    queryBuilder.where(whereQueryOptions.whereClause, whereQueryOptions.whereParameters);

    const result = queryBuilder.getCount();
    return result;
  }

  private _constructInnerJoins(relationOptions: RelationOptions[], queryBuilder: SelectQueryBuilder<T>) {
    if (relationOptions) {
      relationOptions.forEach((relationOption) => {
        logger.debug(`Left join ${relationOption.property} as ${relationOption.alias}`);

        queryBuilder.leftJoinAndSelect(relationOption.property, relationOption.alias);

        const innerOptions = relationOption.options;
        if (innerOptions) {
          this._constructInnerJoins(innerOptions.relationOptions, queryBuilder);
        }
      });
    }
  }

  private _constructWhereClauses(manyOptions: FindManyQueryOptions, queryBuilder: SelectQueryBuilder<T>) {
    if (manyOptions) {
      if (manyOptions.whereClause) {
        logger.debug(`Where clause : ${manyOptions.whereClause}`);
        logger.debug(`Where params : ${JSON.stringify(manyOptions.whereParameters)}`);
        queryBuilder.andWhere(manyOptions.whereClause, manyOptions.whereParameters);
      }

      if (manyOptions.relationOptions) {
        manyOptions.relationOptions.forEach((innerRelationOptions) => {
          this._constructWhereClauses(innerRelationOptions.options, queryBuilder);
        });
      }
    }
  }

  private _constructOrderBy(manyOptions: FindManyQueryOptions, queryBuilder: SelectQueryBuilder<T>) {
    if (manyOptions) {
      if (manyOptions.orderBy) {
        manyOptions.orderBy.forEach((order) => {
          queryBuilder.addOrderBy(`${order.alias}.${order.property}`, order.direction);
        });
      }

      if (manyOptions.relationOptions) {
        manyOptions.relationOptions.forEach((innerRelationOptions) => {
          this._constructOrderBy(innerRelationOptions.options, queryBuilder);
        });
      }
    }
  }
}
