import { bind, BindingScope } from '@loopback/core';
import { Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { AccountToken, Document } from '../models';
import { DocumentRepository } from '../repositories';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class DocumentService extends BaseService<Document, string, DocumentRepository> {
  constructor(@repository(DocumentRepository) repo: DocumentRepository) {
    super(repo);
  }

  findPublicById(id: string, filter: FilterExcludingWhere<Document>): Promise<Document> {
    return this._repository.findPublicById(id, filter);
  }

  findPublic(filter: Filter<Document>): Promise<Document[]> {
    return this._repository.findPublic(filter);
  }

  countPublic(where?: Where): Promise<number> {
    return this._repository.countPublic(where);
  }

  findAuthenticatedById(accountToken: AccountToken, id: string, filter: FilterExcludingWhere<Document>): Promise<Document> {
    return this._repository.findAuthenticatedById(accountToken, id, filter);
  }

  findAuthenticated(accountToken: AccountToken, filter: Filter<Document>): Promise<Document[]> {
    return this._repository.findAuthenticated(accountToken, filter);
  }

  countAuthenticated(accountToken: AccountToken, where?: Where): Promise<number> {
    return this._repository.countAuthenticated(accountToken, where);
  }

}
