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

  async findPublicById(id: string, filter: FilterExcludingWhere<Document>): Promise<Document> {
    const document = await this._repository.findPublicById(id, filter);
    this.injectFiles(document);

    return document;
  }

  async findPublic(filter: Filter<Document>): Promise<Document[]> {
    const documents = await this._repository.findPublic(filter);
    this.injectFiles(documents);

    return documents;
  }

  countPublic(where?: Where): Promise<number> {
    return this._repository.countPublic(where);
  }

  async findAuthenticatedById(accountToken: AccountToken, id: string, filter: FilterExcludingWhere<Document>): Promise<Document> {
    const document = await this._repository.findAuthenticatedById(accountToken, id, filter);
    this.injectFiles(document);

    return document;
  }

  async findAuthenticated(accountToken: AccountToken, filter: Filter<Document>): Promise<Document[]> {
    const documents = await this._repository.findAuthenticated(accountToken, filter);
    this.injectFiles(documents);

    return documents;
  }

  countAuthenticated(accountToken: AccountToken, where?: Where): Promise<number> {
    return this._repository.countAuthenticated(accountToken, where);
  }

  injectFiles(input: Document | Document[]) {
    if (Array.isArray(input)) {
      input.forEach((document) => document.generateFilesIfEmpty());
    } else {
      input.generateFilesIfEmpty();
    }
  }
}
