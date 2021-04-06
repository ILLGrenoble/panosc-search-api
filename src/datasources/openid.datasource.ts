import { Client, Issuer, UserinfoResponse } from 'openid-client';
import { APPLICATION_CONFIG } from '../application-config';
import { logger } from '../utils';

export class OpenIDDataSource {
  static dataSourceName = 'open-id';

  private _client: Client;
  private _clientPromise: Promise<Client>;

  get client(): Promise<Client> {
    if (this._client) {
      return new Promise((resolve) => resolve(this._client));
    } else if (this._clientPromise) {
      return this._clientPromise;
    } else {
      this._clientPromise = new Promise((resolve) => {
        this.createClient().then((client) => {
          this._client = client;
          resolve(client);
        });
      });
      return this._clientPromise;
    }
  }

  constructor() {}

  private async createClient(): Promise<Client> {
    const idpUrl = APPLICATION_CONFIG().idp.url;
    const clientId = APPLICATION_CONFIG().idp.clientId;

    try {
      const issuer = await Issuer.discover(idpUrl);
      const client = new issuer.Client({
        client_id: clientId
      });

      return client;
    } catch (error) {
      logger.error(`Could not create client for OpenID Connect provider at ${idpUrl} : ${error.message}`);

      process.exit();
    }
  }

  async authenticate(token: string): Promise<UserinfoResponse> {
    try {
      const client = await this.client;
      const userInfo = await client.userinfo(token);
      return userInfo;
    } catch (error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
  }
}
