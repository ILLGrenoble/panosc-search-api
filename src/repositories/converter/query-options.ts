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
  orderBy?: { property: string; direction: 'ASC' | 'DESC' }[];
}

export interface IncludeQueryOptions {}

export interface FindOneQueryOptions extends IncludeQueryOptions {}
export interface FindManyQueryOptions extends FindOneQueryOptions, PaginatedQueryOptions, WhereQueryOptions, OrderByQueryOptions {}
