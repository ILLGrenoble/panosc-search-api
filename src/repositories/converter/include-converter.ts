import { InclusionFilter } from '@loopback/filter';
import { logger } from '../../utils';
import { FilterConverter } from './filter-converter';
import { IncludeQueryOptions, RelationOptions } from './query-options';

export class IncludeConverter {
  convert(alias: string, aliasMap: any, includes?: InclusionFilter[]): IncludeQueryOptions {
    if (!includes) {
      return;
    }

    const includeQueryOptions: IncludeQueryOptions = {
      relationOptions: []
    };

    includes.forEach((include) => {
      if (typeof include === 'object') {
        if (include.relation) {
          const relationOptions = this.initialiseRelationOptions(include.relation, alias, aliasMap);
          includeQueryOptions.relationOptions.push(relationOptions);

          // Recurse into the scope to include members and sub-members
          if (include.scope) {
            const scopeOptions = new FilterConverter().convertFindManyFilter(relationOptions.alias, aliasMap, include.scope);

            relationOptions.options = scopeOptions;
          }
        } else {
          logger.warn(`ignoring include filter that contains an element without a relation: ${JSON.stringify(include)}`);
        }
      } else {
        const relationOptions = this.initialiseRelationOptions(include, alias, aliasMap);
        includeQueryOptions.relationOptions.push(relationOptions);
      }
    });

    return includeQueryOptions;
  }

  initialiseRelationOptions(relation: string, parentAlias: string, aliasMap: any): RelationOptions {
    const property = `${parentAlias}.${relation}`;
    const relationInitial = relation.substr(0, 1);
    if (!aliasMap[relationInitial]) {
      aliasMap[relationInitial] = 1;
    }
    const alias = `${relationInitial}${aliasMap[relationInitial]++}`;

    return {
      alias: alias,
      property: property,
      relation: relation
    };
  }
}
