import { bind, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Document } from '../models';
import { DocumentRepository } from '../repositories';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class DocumentService extends BaseService<Document, string, DocumentRepository> {
  constructor(@repository(DocumentRepository) repo: DocumentRepository) {
    super(repo);
  }
}
