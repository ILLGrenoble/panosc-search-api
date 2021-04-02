import { OrderByQueryOptions } from './query-options';

export class OrderConverter {
  convert(alias: string, order: string | string[]): OrderByQueryOptions {
    const orderBys = [];
    if (order) {
      if (Array.isArray(order)) {
        order.forEach((orderBy) => {
          orderBys.push(this._convertOrderText(alias, orderBy));
        });
      } else {
        orderBys.push(this._convertOrderText(alias, order));
      }
    }

    return {
      orderBy: orderBys
    };
  }

  _convertOrderText(alias: string, orderBy: string) {
    orderBy = orderBy.replace(/\s+/g, ' ').trim();
    if (orderBy.toLowerCase().endsWith(' desc')) {
      const property = orderBy.substr(0, orderBy.length - 4);
      return { alias, property, direction: 'DESC' };
    } else if (orderBy.toLowerCase().endsWith(' asc')) {
      const property = orderBy.substr(0, orderBy.length - 4);
      return { alias, property, direction: 'ASC' };
    } else {
      return { alias: alias, property: orderBy, direction: 'ASC' };
    }
  }
}
