export interface PaginatedQueryOptions {
  limit?: number;
  offset?: number;
}

export interface WhereQueryOptions {
  whereClause?: string;
  whereParameters?: any;
  isComposite?: boolean;
}

export interface OrderByQueryOptions {
  orderBy?: { alias:string, property: string; direction: 'ASC' | 'DESC' }[];
}

export interface RelationOptions {
  relation: string;
  property: string;
  alias: string;
  options?: FindManyQueryOptions;
}

export interface IncludeQueryOptions {
  relationOptions?: RelationOptions[];
}

export interface FindOneQueryOptions extends IncludeQueryOptions {}
export interface FindManyQueryOptions extends FindOneQueryOptions, PaginatedQueryOptions, WhereQueryOptions, OrderByQueryOptions {}
