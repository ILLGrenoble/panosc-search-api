import { Filter } from '@loopback/filter';
import { PaginatedQueryOptions } from './query-options';

export class PaginationConverter {
  convert(filter: Filter): PaginatedQueryOptions {
    return {
      offset: filter.offset ? filter.offset : filter.skip,
      limit: filter.limit
    };
  }
}
