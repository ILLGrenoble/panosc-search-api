import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import { Document } from '../models';
import { DocumentRepository } from '../repositories';
import { WhereProvider } from './where.provider';

export class DocumentWhereProvider extends WhereProvider<Document, string> {
  constructor(@inject(RestBindings.Http.REQUEST) request: Request, @repository(DocumentRepository) repository: DocumentRepository) {
    super(request, repository);
  }
}
