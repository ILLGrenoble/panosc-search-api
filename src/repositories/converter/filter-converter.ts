import { Filter } from '@loopback/filter';
import { IncludeConverter } from './include-converter';
import { OrderConverter } from './order-converter';
import { PaginationConverter } from './pagination-converter';
import { FindManyQueryOptions, FindOneQueryOptions } from './query-options';
import { WhereConverter } from './where-converter';

export class FilterConverter<T extends {}> {
  private _whereConverter = new WhereConverter();
  private _orderConverter = new OrderConverter();
  private _paginationConverter = new PaginationConverter();
  private _includeConverter = new IncludeConverter();

  constructor() {}

  convertFindManyFilter(alias: string, aliasMap: any, filter?: Filter<T>): FindManyQueryOptions {
    if (!filter) {
      return;
    }

    // Convert pagination
    const paginatedQueryOptions = this._paginationConverter.convert(filter);

    // Convert where
    const whereQueryOptions = this._whereConverter.convert(filter.where, alias);

    // Convert order
    const orderByQueryOptions = this._orderConverter.convert(filter.order);

    // Convert include
    const includeQueryOptions = this._includeConverter.convert(alias, aliasMap, filter.include);

    const queryOptions: FindManyQueryOptions = {
      ...whereQueryOptions,
      ...orderByQueryOptions,
      ...paginatedQueryOptions,
      ...includeQueryOptions
    };

    return queryOptions;
  }

  convertFindOneFilter(alias: string, aliasMap: any, filter?: Filter<T>): FindOneQueryOptions {
    if (!filter) {
      return;
    }

    // Convert include
    const includeQueryOptions = this._includeConverter.convert(alias, aliasMap, filter.include);

    const queryOptions: FindOneQueryOptions = {
      ...includeQueryOptions
    };

    return queryOptions;
  }
}