import { Client, createRestAppClient, givenHttpServerConfig } from '@loopback/testlab';
import { SearchApiApplication } from '../..';
import { TypeORMDataSource } from '../../datasources';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new SearchApiApplication({
    rest: restConfig,
    ignoreDotenv: true
  });

  await app.boot();
  await app.start();
  const datasource: TypeORMDataSource = await app.get('datasources.typeorm');

  const client = createRestAppClient(app);

  return { app, client, datasource };
}

export interface AppWithClient {
  app: SearchApiApplication;
  client: Client;
  datasource: TypeORMDataSource;
}
