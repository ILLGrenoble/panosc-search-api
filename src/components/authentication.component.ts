import { bind, BindingKey, ContextTags } from '@loopback/context';
import { Component, ProviderMap } from '@loopback/core';
import { AccountToken } from '../models';
import { AccountTokenProvider } from '../providers';

export namespace AuthentiationComponent {
  export const ACCOUNT_TOKEN = BindingKey.create<AccountToken>('AuthenticationComponent.AccountToken');
}

@bind({ tags: { [ContextTags.KEY]: 'components.AuthenticationComponent' } })
export class AuthenticationComponent implements Component {
  providers?: ProviderMap = { [AuthentiationComponent.ACCOUNT_TOKEN.key]: AccountTokenProvider };

  constructor() {}
}
