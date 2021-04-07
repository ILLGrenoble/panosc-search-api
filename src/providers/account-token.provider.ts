import { bind, BindingScope, inject, Provider } from '@loopback/core';
import { Request, RestBindings } from '@loopback/rest';
import { APPLICATION_CONFIG } from '../application-config';
import { OpenIDDataSource } from '../datasources';
import { AccountToken } from '../models';
import { logger } from '../utils';

@bind({ scope: BindingScope.TRANSIENT })
export class AccountTokenProvider implements Provider<AccountToken> {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request, @inject('datasources.open-id') private _openIdDataSource: OpenIDDataSource) {}

  value() {
    return this._authenticate();
  }

  private async _authenticate(): Promise<AccountToken> {
    try {
      // Get access token from header
      const token = this.request.headers.access_token as string;

      if (token) {
        // Authenticate the user
        const userInfo = await this._openIdDataSource.authenticate(token);

        // Get userId from claims (required keycloak to be configured correctly)
        const userIdClaimKey = APPLICATION_CONFIG().idp.userIdClaimKey;
        const userId = userInfo[userIdClaimKey] as string;

        const accountToken = new AccountToken({
          id: `${userId}`,
          username: userInfo['preferred_username']
        });

        logger.info(`User ${accountToken.username} (${accountToken.id}) requesting ${this.request.baseUrl}/${this.request.path}`);

        return accountToken;
      } else {
        logger.info(`User <anonymous> requesting ${this.request.baseUrl}/${this.request.path}`);
      }
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
    }
  }
}
