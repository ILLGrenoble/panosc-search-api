import { EntityMetadata } from 'typeorm';

export class WhereValidator {
  validate(where: any, entityMetadata: EntityMetadata) {
    const properties = entityMetadata.ownColumns.map((column) => column.propertyName);

    for (const key in where) {
      if (key === 'and') {
        where.and.forEach((and: any) => this.validate(and, entityMetadata));
      } else if (key === 'or') {
        where.or.forEach((or: any) => this.validate(or, entityMetadata));
      } else {
        if (!properties.includes(key)) {
          throw new Error(`field '${key}' in where clause is not a member of ${entityMetadata.name}`);
        }
      }
    }
  }
}
