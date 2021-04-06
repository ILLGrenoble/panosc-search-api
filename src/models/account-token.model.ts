export class AccountToken {
  id: string;

  username: string;

  constructor(data?: Partial<AccountToken>) {
    Object.assign(this, data);
  }
}
