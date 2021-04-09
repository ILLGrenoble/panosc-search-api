import { bind, BindingScope, Provider } from '@loopback/core';
import { Filter } from '@loopback/filter';
import { HttpErrors, Request } from '@loopback/rest';
import { EntityMetadata } from 'typeorm';
import { BaseRepository } from '../repositories';
import { FilterValidator } from './filter-validator';
import {TextSearchModifier} from './text-search-modifier';

@bind({ scope: BindingScope.TRANSIENT })
export class FilterProvider<T extends {}, ID> implements Provider<Filter> {
  constructor(private _request: Request, private _repository: BaseRepository<T, ID>) {}

  value(): Promise<Filter<T>> {
    return this._getFilter();
  }

  private async _getFilter(): Promise<Filter<T>> {
    const filterString = this._request.query['filter'] as string;

    if (filterString) {
      let filter: Filter<T>;
      try {
        filter = JSON.parse(filterString);
      } catch (error) {
        throw new HttpErrors.BadRequest(`Failed to parse request filter: ${error.message}`);
      }
      const entityMetadata = await this._repository.getEntityMetadata();

      // Modify filter for generic text search
      const textSearchModifier = new TextSearchModifier();
      textSearchModifier.modifyFilter(filter, entityMetadata);

      try {
        // Vaidate filter structure
        const filterValidator = new FilterValidator();
        filterValidator.validate(filter, entityMetadata);
      } catch (error) {
        throw new HttpErrors.BadRequest(`Filter structure is invalid: ${error.message}`);
      }
      return filter;
    }
  }
}
