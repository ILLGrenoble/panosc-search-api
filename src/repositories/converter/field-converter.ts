import { Fields } from '@loopback/filter';
import { FieldQueryOptions } from './query-options';

export class FieldConverter {
  convert(alias: string, fields?: Fields): FieldQueryOptions {
    const fieldOptions: { alias: string, property: string; include: boolean }[] = [];
    if (fields) {
      if (Array.isArray(fields)) {
        fields.forEach((field) => {
          fieldOptions.push({ alias: alias, property: field, include: true });
        });
      } else {
        for (const [key, value] of Object.entries(fields)) {
          if (typeof value === 'boolean') {
            fieldOptions.push({ alias: alias, property: key, include: value });
          }
        }
      }
    }

    return {
      fields: fieldOptions
    };
  }
}
