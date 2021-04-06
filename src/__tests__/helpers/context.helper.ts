import { testDataSource } from '../fixtures/datasources/testdb.datasource';
import { DocumentRepository } from '../../repositories';
import { DocumentService } from '../../services';

export interface TestApplicationContext {
  documentRepository: DocumentRepository;
  documentService: DocumentService;
}

export function createTestApplicationContext(): TestApplicationContext {
  const documentRepository = new DocumentRepository(testDataSource);
  const documentService = new DocumentService(documentRepository);

  return {
    documentRepository,
    documentService,
  };
}
