import { AnyObject, Command, NamedParameters, PositionalParameters, Where } from '@loopback/repository';
import { FindManyOptions } from 'typeorm';
import { BaseRepository } from '../repositories';

export class BaseService<T extends { pid: string }, R extends BaseRepository<T, string>> {
  constructor(protected _repository: R) {}

  getAll(): Promise<T[]> {
    return this._repository.find();
  }

  getById(id: string): Promise<T> {
    return this._repository.findById(id);
  }

  save(object: T): Promise<T> {
    return this._repository.save(object);
  }

  delete(object: T): Promise<boolean> {
    return this._repository.deleteById(object.pid);
  }

  count(where?: Where): Promise<number> {
    return this._repository.count(where);
  }

  update(id: string, data: object): Promise<T> {
    return this._repository.updateById(id, data);
  }

  get(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  async execute(command: Command, parameters?: NamedParameters | PositionalParameters): Promise<AnyObject> {
    return this._repository.execute(command, parameters);
  }
}
