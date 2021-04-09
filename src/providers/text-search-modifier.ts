import { Filter } from '@loopback/filter';
import { EntityMetadata } from 'typeorm';

const textSearchFieldsForEntities = [
  {
    name: 'Dataset',
    fields: ['title']
  },
  {
    name: 'Document',
    fields: ['title', 'summary']
  },
  {
    name: 'File',
    fields: ['name']
  },
  {
    name: 'Instrument',
    fields: ['name', 'facility']
  },
  {
    name: 'Sample',
    fields: ['name', 'description']
  },
  {
    name: 'Technique',
    fields: ['name']
  },
  {
    name: 'Person',
    fields: ['firstName', 'lastName', 'fullName']
  },
  {
    name: 'Affiliation',
    fields: ['name', 'address', 'city', 'country']
  }
];

export class TextSearchModifier {

  modifyFilter(filter: Filter, entityMetadata: EntityMetadata) {
    filter.where = this.modifyWhere(filter.where, entityMetadata);

    if (filter.include) {
      filter.include.forEach((include: any) => {
        if (include.relation && include.scope) {
          const relation = entityMetadata.relations.find((relation) => relation.propertyName === include.relation);
          const relationMetadata = relation.inverseEntityMetadata;
          this.modifyFilter(include.scope, relationMetadata);
        }
      });
    }
  }

  modifyWhere(where: any, entityMetadata: EntityMetadata): any {
    if (where) {
      if (where.and) {
        where.and = where.and.map((and: any) => this.modifyWhere(and, entityMetadata));
      }

      if (where.or) {
        where.or = where.or.map((or: any) => this.modifyWhere(or, entityMetadata));
      }

      if (where.text) {
        where = this._convertTextSearch(entityMetadata.name, where);
      }
    }

    return where;
  }

  private _convertTextSearch(entityName: string, where: any): any {
    const config = textSearchFieldsForEntities.find((entity) => entity.name === entityName);
    if (config) {
      const search = this._parseTextInput(config, where);
      delete where.text;
      where = this._appendSearchToQuery(search, where);
    }
    return where;
  }

  private _parseTextInput(config: any, where: any): any {
    if (config.fields.length === 1) {
      return {
        [config.fields[0]]: { ilike: `%${where.text}%` }
      };
    } else {
      return {
        or: config.fields.map((field: string) => ({
          [field]: { ilike: `%${where.text}%` }
        }))
      };
    }
  }

  private _appendSearchToQuery(search: any, where: any): any {
    if (Object.keys(where).length === 0) {
      return search;
    } else {
      return {
        and: [search, where]
      };
    }
  }
}
