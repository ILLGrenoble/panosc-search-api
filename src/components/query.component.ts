import { bind, BindingKey, ContextTags } from '@loopback/context';
import { Component, ProviderMap } from '@loopback/core';
import { Filter, Where } from '@loopback/filter';
import { Dataset, Document } from '../models';
import { DatasetFilterProvider, DatasetWhereProvider, DocumentFilterProvider, DocumentWhereProvider, InstrumentFilterProvider, InstrumentWhereProvider } from '../providers';

@bind({ tags: { [ContextTags.KEY]: 'components.QueryComponent' } })
export class QueryComponent implements Component {
  static DOCUMENT_FILTER = BindingKey.create<Filter<Document>>('QueryComponent.DocumentFilter');
  static DATASET_FILTER = BindingKey.create<Filter<Dataset>>('QueryComponent.DatasetFilter');
  static INSTRUMENT_FILTER = BindingKey.create<Filter<Dataset>>('QueryComponent.InstrumentFilter');
  static DOCUMENT_WHERE = BindingKey.create<Where<Document>>('QueryComponent.DocumentWhere');
  static DATASET_WHERE = BindingKey.create<Where<Dataset>>('QueryComponent.DatasetWhere');
  static INSTRUMENT_WHERE = BindingKey.create<Where<Dataset>>('QueryComponent.InstrumentWhere');

  providers?: ProviderMap = {
    [QueryComponent.DOCUMENT_FILTER.key]: DocumentFilterProvider,
    [QueryComponent.DATASET_FILTER.key]: DatasetFilterProvider,
    [QueryComponent.INSTRUMENT_FILTER.key]: InstrumentFilterProvider,
    [QueryComponent.DOCUMENT_WHERE.key]: DocumentWhereProvider,
    [QueryComponent.DATASET_WHERE.key]: DatasetWhereProvider,
    [QueryComponent.INSTRUMENT_WHERE.key]: InstrumentWhereProvider
  };

  constructor() {}
}
