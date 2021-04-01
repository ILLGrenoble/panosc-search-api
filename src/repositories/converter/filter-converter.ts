import { Filter } from '@loopback/filter';
import { OrderConverter } from './order-converter';
import { PaginationConverter } from './pagination-converter';
import { FindManyQueryOptions, FindOneQueryOptions } from './query-options';
import { WhereConverter } from './where-converter';

export class FilterConverter<T extends {}> {
  private _whereConverter = new WhereConverter();
  private _orderConverter = new OrderConverter();
  private _paginationConverter = new PaginationConverter();

  constructor() {}

  convertFindManyFilter(alias: string, filter?: Filter<T>): FindManyQueryOptions {
    if (!filter) {
      return;
    }

    // Convert pagination
    const paginatedQueryOptions = this._paginationConverter.convert(filter);

    // Convert where
    const whereQueryOptions = this._whereConverter.convert(filter.where, alias);

    // Convert order
    const orderByQueryOptions = this._orderConverter.convert(filter.order);

    const queryOptions: FindManyQueryOptions = {
      ...whereQueryOptions,
      ...orderByQueryOptions,
      ...paginatedQueryOptions
    };

    return queryOptions;
  }

  convertFindOneFilter(alias: string, filter?: Filter<T>): FindOneQueryOptions {
    if (!filter) {
      return;
    }

    let queryOptions = {};

    return queryOptions;
  }
}
