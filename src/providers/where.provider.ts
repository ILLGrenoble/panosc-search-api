import { bind, BindingScope, Provider } from '@loopback/core';
import { Where } from '@loopback/filter';
import { HttpErrors, Request } from '@loopback/rest';
import { BaseRepository } from '../repositories';
import { TextSearchModifier } from './text-search-modifier';
import { WhereValidator } from './where-validator';

@bind({ scope: BindingScope.TRANSIENT })
export class WhereProvider<T extends {}, ID> implements Provider<Where> {
  constructor(private _request: Request, private _repository: BaseRepository<T, ID>) {}

  value(): Promise<Where> {
    return this._getWhere();
  }

  private async _getWhere(): Promise<Where<T>> {
    const whereString = this._request.query['where'] as string;

    if (whereString) {
      let where: Where<T>;
      try {
        where = JSON.parse(whereString);
      } catch (error) {
        throw new HttpErrors.BadRequest(`Failed to parse requested where clause: ${error.message}`);
      }

      const entityMetadata = await this._repository.getEntityMetadata();

      // Modify filter for generic text search
      const textSearchModifier = new TextSearchModifier();
      where = textSearchModifier.modifyWhere(where, entityMetadata);

      try {
        // Vaidate where structure
        const whereValidator = new WhereValidator();
        whereValidator.validate(where, entityMetadata);
      } catch (error) {
        throw new HttpErrors.BadRequest(`Where structure is invalid: ${error.message}`);
      }
      return where;
    }
  }
}
