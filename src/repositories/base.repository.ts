import { AnyObject, Command, Filter, FilterExcludingWhere, NamedParameters, PositionalParameters, Where } from '@loopback/repository';
import { FindManyOptions, ObjectType, Repository } from 'typeorm';
import { TypeORMDataSource } from '../datasources';
import { QueryExecutor } from './query-executor';

export class BaseRepository<T extends {}, ID> {
  private _repository: Repository<T>;

  private get entityAlias(): string {
    return this._entityClass.name.toLowerCase();
  }

  private _builder = (alias: string) => {
    return this._repository.createQueryBuilder(alias);
  };

  constructor(private _dataSource: TypeORMDataSource, private _entityClass: ObjectType<T>) {}

  async init(): Promise<Repository<T>> {
    if (this._repository == null) {
      this._repository = await this._dataSource.repository(this._entityClass);
    }
    return this._repository;
  }

  async findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<T> {
    await this.init();

    return new QueryExecutor<ID, T>(this._builder).findOne(id, this.entityAlias, filter);
  }

  async find(filter?: Filter<T>): Promise<T[]> {
    await this.init();

    return new QueryExecutor<ID, T>(this._builder).findMany(this.entityAlias, filter);
  }

  async count(where?: Where): Promise<number> {
    await this.init();

    return new QueryExecutor<ID, T>(this._builder).count(this.entityAlias, where);
  }

  async save(entity: T): Promise<T> {
    await this.init();
    const result = this._repository.save(entity);
    return result;
  }

  async get(options?: FindManyOptions<T>): Promise<T[]> {
    await this.init();

    const result = await this._repository.find(options);
    return result;
  }

  async getById(id: ID): Promise<T> {
    await this.init();
    const result = await this._repository.findOne(id);
    return result;
  }

  async deleteById(id: ID): Promise<boolean> {
    await this.init();

    await this._repository.delete(id);
    return true;
  }

  async updateById(id: ID, data: object): Promise<T> {
    await this.init();

    await this._repository.update(id, data);
    return this.getById(id);
  }

  async exists(id: ID): Promise<boolean> {
    await this.init();
    const result = await this._repository.findOne(id);
    return result != null;
  }

  async execute(command: Command, parameters?: NamedParameters | PositionalParameters): Promise<AnyObject> {
    await this.init();
    const result = await this._repository.query(<string>command, <any[]>parameters);
    return result;
  }
}
