import {OrderByQueryOptions} from './query-options';

export class OrderConverter {
  convert(order: string | string[]): OrderByQueryOptions {
    const orderBys = [];
    if (order) {
      if (Array.isArray(order)) {
        order.forEach((orderBy) => {
          orderBys.push(this._convertOrderText(orderBy));
        });
      } else {
        orderBys.push(this._convertOrderText(order));
      }
    }

    return {
      orderBy: orderBys
    };
  }

  _convertOrderText(orderBy: string) {
    orderBy = orderBy.replace(/\s+/g, ' ').trim().toLowerCase();
    if (orderBy.endsWith(' desc')) {
      const property = orderBy.substr(0, orderBy.length - 4);
      return { property: property, direction: 'DESC' };
    } else if (orderBy.endsWith(' asc')) {
      const property = orderBy.substr(0, orderBy.length - 4);
      return { property: property, direction: 'ASC' };
    } else {
      return { property: orderBy, direction: 'ASC' };
    }
  }

}
