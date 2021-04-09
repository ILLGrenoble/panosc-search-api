import { Filter } from '@loopback/filter';
import { EntityMetadata } from 'typeorm';
import { WhereValidator } from './where-validator';

export class FilterValidator {
  validate(filter: Filter<any>, entityMetadata: EntityMetadata) {
    const properties = entityMetadata.ownColumns.map((column) => column.propertyName);
    const relations = entityMetadata.relations.map((relation) => relation.propertyName);

    let fields = filter && filter.fields;
    let where = filter && filter.where;
    let includes = filter && filter.include;

    // Validate fields
    if (fields) {
      if (!Array.isArray(fields)) {
        fields = Object.keys(fields);
      }

      fields.forEach((field) => {
        if (!properties.includes(field) && !relations.includes(field)) {
          throw new Error(`included field '${field}' is not a member of ${entityMetadata.name}`);
        }
      });
    }

    // Validate where
    if (where) {
      const whereValidator = new WhereValidator();
      whereValidator.validate(where, entityMetadata);
    }

    // Validate includes
    if (includes) {
      includes.forEach((include) => {
        if (typeof include === 'object') {
          if (!relations.includes(include.relation)) {
            throw new Error(`included relation '${include.relation}' is not a member of ${entityMetadata.name}`);
          }

          const includeProperties = Object.keys(include);
          includeProperties.forEach((includeProperty) => {
            if (!['scope', 'relation'].includes(includeProperty)) {
              throw new Error(`Invalid relation '${include.relation}' - found property '${includeProperty}' but should be 'scope'`);
            }
          });

          const relation = entityMetadata.relations.find((relation) => relation.propertyName === include.relation);
          const relationMetadata = relation.inverseEntityMetadata;

          this.validate(include.scope, relationMetadata);
        } else {
          if (!relations.includes(include as string)) {
            throw new Error(`included relation '${include}' is not a member of ${entityMetadata.name}`);
          }
        }
      });
    }
  }
}
