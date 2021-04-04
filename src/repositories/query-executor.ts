import { FilterExcludingWhere, Where } from '@loopback/filter';
import { SelectQueryBuilder } from 'typeorm';
import { logger } from '../utils';
import { FilterConverter } from './converter/filter-converter';
import { FindManyQueryOptions, FindOneQueryOptions, RelationOptions } from './converter/query-options';
import { WhereConverter } from './converter/where-converter';

export class QueryExecutor<ID, T extends {}> {
  constructor(private _builder: (alias: string) => SelectQueryBuilder<T>) {}

  async findOne(id: ID, alias: string, filter?: FilterExcludingWhere<T>): Promise<T> {
    const queryBuilder = this._builder(alias);

    const options = new FilterConverter<T>().convertFindOneFilter(alias, {}, filter);

    if (options) {
      // construct the request
      this._constructInnerJoins(options.relationOptions, queryBuilder);
      this._constructWhereClauses(options, queryBuilder);
      this._constructOrderBy(options, queryBuilder);
    }

    // execute the request
    const result = await queryBuilder.andWhereInIds(id).getOne();

    if (options) {
      // filter included and excluded fields
      this._filterFields(result, options);
    }

    return result;
  }

  async findMany(alias: string, filter?: FilterExcludingWhere<T>): Promise<T[]> {
    const queryBuilder = this._builder(alias);

    const options = new FilterConverter<T>().convertFindManyFilter(alias, {}, filter);

    if (options) {
      // construct the request
      this._constructInnerJoins(options.relationOptions, queryBuilder);
      this._constructWhereClauses(options, queryBuilder);
      this._constructOrderBy(options, queryBuilder);

      if (options.limit) {
        queryBuilder.take(options.limit);
      }
      if (options.offset) {
        queryBuilder.skip(options.offset);
      }
    }

    // execute the request
    const result = await queryBuilder.getMany();

    if (options) {
      // filter included and excluded fields
      result.forEach((resultEntity) => this._filterFields(resultEntity, options));
    }

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

  private _filterFields(entity: any, manyOptions?: FindOneQueryOptions) {
    if (manyOptions) {
      if (manyOptions.fields && manyOptions.fields.length > 0) {
        const entityMembers = Object.getOwnPropertyNames(entity);

        const falseFields = manyOptions.fields.filter((field) => field.include === false);

        if (falseFields.length > 0) {
          // Remove fields that have been explicitly excluded
          const unselectedProperties = manyOptions.fields.map((field) => field.property);

          entityMembers.forEach((entityMember) => {
            if (unselectedProperties.includes(entityMember)) {
              delete entity[entityMember];
            }
          });
        } else {
          // Include fields that have been explicitly included or relations that have been included
          const selectedProperties = manyOptions.fields.map((field) => field.property);
          const includedRelations = manyOptions.relationOptions ? manyOptions.relationOptions.map((relationOption) => relationOption.relation) : [];

          entityMembers.forEach((entityMember) => {
            if (!selectedProperties.includes(entityMember) && !includedRelations.includes(entityMember)) {
              delete entity[entityMember];
            }
          });
        }
      }

      if (manyOptions.relationOptions) {
        // Recurse over included relations
        manyOptions.relationOptions.forEach((innerRelationOptions) => {
          const relation = innerRelationOptions.relation;
          const member = entity[relation];
          if (member) {
            if (Array.isArray(member)) {
              member.forEach((memberElement) => {
                this._filterFields(memberElement, innerRelationOptions.options);
              });
            } else {
              this._filterFields(member, innerRelationOptions.options);
            }
          }
        });
      }
    }
  }
}
