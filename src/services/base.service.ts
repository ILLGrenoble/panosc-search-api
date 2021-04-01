import { AnyObject, Command, Filter, FilterExcludingWhere, NamedParameters, PositionalParameters, Where } from '@loopback/repository';
import { FindManyOptions } from 'typeorm';
import { BaseRepository } from '../repositories';

export class BaseService<T extends { pid: ID }, ID, R extends BaseRepository<T, ID>> {
  constructor(protected _repository: R) {}

  findById(id: ID, filter: FilterExcludingWhere<T>): Promise<T> {
    return this._repository.findById(id, filter);
  }

  find(filter: Filter<T>): Promise<T[]> {
    return this._repository.find(filter);
  }

  count(where?: Where): Promise<number> {
    return this._repository.count(where);
  }

  getAll(): Promise<T[]> {
    return this._repository.find();
  }

  getById(id: ID): Promise<T> {
    return this._repository.getById(id);
  }

  save(object: T): Promise<T> {
    return this._repository.save(object);
  }

  delete(object: T): Promise<boolean> {
    return this._repository.deleteById(object.pid);
  }

  update(id: ID, data: object): Promise<T> {
    return this._repository.updateById(id, data);
  }

  get(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.get(options);
  }

  async execute(command: Command, parameters?: NamedParameters | PositionalParameters): Promise<AnyObject> {
    return this._repository.execute(command, parameters);
  }
}
