import { Filter, Where } from '@loopback/filter';

export interface PaginatedQueryOptions {
  limit?: number;
  offset?: number;
}

export interface WhereQueryOptions {
  whereClause?: string;
  whereParameters?: any;
  isComposite?: boolean;
}

export interface QueryOptions extends PaginatedQueryOptions, WhereQueryOptions {}

export class FilterConverter<T extends {}> {
  constructor() {}

  convertFilter(filter?: Filter<T>): QueryOptions {
    if (!filter) {
      return;
    }

    let queryOptions = {};

    queryOptions = this._convertFilterPagination(filter, queryOptions);

    queryOptions = this._convertFilterWhere(filter.where, queryOptions);

    return queryOptions;
  }

  _convertFilterPagination(filter: Filter<T>, queryOptions: QueryOptions): QueryOptions {
    return {
      ...queryOptions,
      offset: filter.skip,
      limit: filter.limit
    };
  }

  _convertFilterWhere(where: Where<T>, queryOptions: QueryOptions): QueryOptions {
    queryOptions = {
      ...queryOptions,
      ...this.convertWhere(where)
    };

    return queryOptions;
  }

  convertWhere(where: any, parameters?: any): WhereQueryOptions {
    function getNextParameterName(params: any): string {
      const index = Object.keys(params).length + 1;
      return `p${index}`;
    }

    const clauses: string[] = [];
    parameters = parameters || {};

    if (where) {
      if (where.and) {
        const andClauses = where.and.map((w: any) => this.convertWhere(w, parameters));
        const and = andClauses.map((pc: WhereQueryOptions) => pc.whereClause).join(' AND ');
        clauses.push(and);
        andClauses.forEach((pc: WhereQueryOptions) => {
          Object.assign(parameters, pc.whereParameters);
        });
      }
      if (where.or) {
        const orClauses = where.or.map((w: any) => this.convertWhere(w, parameters));
        const or = orClauses.map((pc: WhereQueryOptions) => (pc.isComposite ? `(${pc.whereClause})` : pc.whereClause)).join(' OR ');
        clauses.push(`(${or})`);
        orClauses.forEach((pc: WhereQueryOptions) => {
          Object.assign(parameters, pc.whereParameters);
        });
      }

      for (const key in where) {
        if (key === 'and' || key === 'or') continue;

        let clause: string;
        const condition = where[key];
        if (condition.eq) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.eq;
          clause = `${key} = :${parameterName}`;
        } else if (condition.neq) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.neq;
          clause = `${key} != :${parameterName}`;
        } else if (condition.lt) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.lt;
          clause = `${key} < :${parameterName}`;
        } else if (condition.lte) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.lte;
          clause = `${key} <= :${parameterName}`;
        } else if (condition.gt) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.gt;
          clause = `${key} > :${parameterName}`;
        } else if (condition.gte) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.gte;
          clause = `${key} >= :${parameterName}`;
        } else if (condition.like) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.like;
          clause = `${key} LIKE :${parameterName}`;
        } else if (condition.nlike) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.like;
          clause = `${key} NOT LIKE :${parameterName}`;
        } else if (condition.inq) {
          let vals = '';
          for (let i = 0; i < condition.inq.length; i++) {
            const parameterValue = condition.inq[i];
            const parameterName = getNextParameterName(parameters);
            parameters[parameterName] = parameterValue;

            vals += i > 0 ? `, :${parameterName}` : `:${parameterName}`;
          }

          clause = `${key} IN (${vals})`;
        } else if (condition.nin) {
          let vals = '';
          for (let i = 0; i < condition.nin.length; i++) {
            const parameterValue = condition.nin[i];
            const parameterName = getNextParameterName(parameters);
            parameters[parameterName] = parameterValue;

            vals += i > 0 ? `, :${parameterName}` : `:${parameterName}`;
          }

          clause = `${key} NOT IN (${vals})`;
        } else if (condition.between) {
          const p1Name = getNextParameterName(parameters);
          parameters[p1Name] = condition.between[0];
          const p2Name = getNextParameterName(parameters);
          parameters[p2Name] = condition.between[1];
          clause = `${key} BETWEEN :${p1Name} AND :${p2Name}`;
        } else {
          // Shorthand form: {x:1} => X = 1
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition;
          clause = `${key} = :${parameterName}`;
        }
        clauses.push(clause);
      }
    }

    return {
      whereClause: clauses.join(' AND '),
      whereParameters: parameters,
      isComposite: where ? where.and != null || where.or != null || clauses.length > 1 : false
    };
  }
}
