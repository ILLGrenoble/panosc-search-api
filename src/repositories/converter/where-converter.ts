import { WhereQueryOptions } from './query-options';

export class WhereConverter {
  convert(where: any, alias: string, parameters?: any): WhereQueryOptions {
    function getNextParameterName(params: any): string {
      const index = Object.keys(params).length + 1;
      return `${alias}_p${index}`;
    }

    const clauses: string[] = [];
    parameters = parameters || {};

    if (where) {
      if (where.and) {
        const andClauses = where.and.map((w: any) => this.convert(w, alias, parameters));
        const and = andClauses.map((pc: WhereQueryOptions) => pc.whereClause).join(' AND ');
        clauses.push(and);
        andClauses.forEach((pc: WhereQueryOptions) => {
          Object.assign(parameters, pc.whereParameters);
        });
      }
      if (where.or) {
        const orClauses = where.or.map((w: any) => this.convert(w, alias, parameters));
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
          clause = `${alias}.${key} = :${parameterName}`;
        } else if (condition.neq) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.neq;
          clause = `${alias}.${key} != :${parameterName}`;
        } else if (condition.lt) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.lt;
          clause = `${alias}.${key} < :${parameterName}`;
        } else if (condition.lte) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.lte;
          clause = `${alias}.${key} <= :${parameterName}`;
        } else if (condition.gt) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.gt;
          clause = `${alias}.${key} > :${parameterName}`;
        } else if (condition.gte) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.gte;
          clause = `${alias}.${key} >= :${parameterName}`;
        } else if (condition.like) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.like;
          clause = `${alias}.${key} LIKE :${parameterName}`;
        } else if (condition.nlike) {
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition.like;
          clause = `${alias}.${key} NOT LIKE :${parameterName}`;
        } else if (condition.inq) {
          let vals = '';
          for (let i = 0; i < condition.inq.length; i++) {
            const parameterValue = condition.inq[i];
            const parameterName = getNextParameterName(parameters);
            parameters[parameterName] = parameterValue;

            vals += i > 0 ? `, :${parameterName}` : `:${parameterName}`;
          }

          clause = `${alias}.${key} IN (${vals})`;
        } else if (condition.nin) {
          let vals = '';
          for (let i = 0; i < condition.nin.length; i++) {
            const parameterValue = condition.nin[i];
            const parameterName = getNextParameterName(parameters);
            parameters[parameterName] = parameterValue;

            vals += i > 0 ? `, :${parameterName}` : `:${parameterName}`;
          }

          clause = `${alias}.${key} NOT IN (${vals})`;
        } else if (condition.between) {
          const p1Name = getNextParameterName(parameters);
          parameters[p1Name] = condition.between[0];
          const p2Name = getNextParameterName(parameters);
          parameters[p2Name] = condition.between[1];
          clause = `${alias}.${key} BETWEEN :${p1Name} AND :${p2Name}`;
        } else {
          // Shorthand form: {x:1} => X = 1
          const parameterName = getNextParameterName(parameters);
          parameters[parameterName] = condition;
          clause = `${alias}.${key} = :${parameterName}`;
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
