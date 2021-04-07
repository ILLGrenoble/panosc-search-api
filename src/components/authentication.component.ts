import { bind, BindingKey, ContextTags } from '@loopback/context';
import { Component, ProviderMap } from '@loopback/core';
import { AccountToken } from '../models';
import { AccountTokenProvider } from '../providers';


@bind({ tags: { [ContextTags.KEY]: 'components.AuthenticationComponent' } })
export class AuthenticationComponent implements Component {
  static ACCOUNT_TOKEN = BindingKey.create<AccountToken>('AuthenticationComponent.AccountToken');

  providers?: ProviderMap = { [AuthenticationComponent.ACCOUNT_TOKEN.key]: AccountTokenProvider };

  constructor() {}
}
