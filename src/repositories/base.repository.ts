import { AnyObject, Command, Filter, FilterExcludingWhere, NamedParameters, PositionalParameters, Where } from '@loopback/repository';
import { FindManyOptions, ObjectType, Repository } from 'typeorm';
import { TypeORMDataSource } from '../datasources';
import { logger } from '../utils';
import { FilterConverter } from './converter/filter-converter';
import {WhereConverter} from './converter/where-converter';

/*
 * Some implementation details from https://github.com/raymondfeng/loopback4-extension-repository-typeorm
 */
export class BaseRepository<T extends {}, ID> {
  private _repository: Repository<T>;

  private get entityAlias(): string {
    return this._entityClass.name.toLowerCase();
  }

  constructor(private _dataSource: TypeORMDataSource, private _entityClass: ObjectType<T>) {}

  async init(): Promise<Repository<T>> {
    if (this._repository == null) {
      this._repository = await this._dataSource.repository(this._entityClass);
    }
    return this._repository;
  }

  async findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<T> {
    await this.init();

    const options = new FilterConverter<T>().convertFindOneFilter(this.entityAlias, filter);

    const queryBuilder = this._repository.createQueryBuilder(this.entityAlias);
    if (options) {
    }

    const result = await queryBuilder.whereInIds(id).getOne();
    return result;
  }

  async find(filter?: Filter<T>): Promise<T[]> {
    await this.init();

    const options = new FilterConverter<T>().convertFindManyFilter(this.entityAlias, filter);
    const queryBuilder = this._repository.createQueryBuilder(this.entityAlias);

    if (options) {
      if (options.whereClause) {
        logger.debug(`Where clause : ${options.whereClause}`);
        logger.debug(`Where params : ${JSON.stringify(options.whereParameters)}`);
        queryBuilder.where(options.whereClause, options.whereParameters);
      }
      if (options.limit) {
        queryBuilder.limit(options.limit);
      }
      if (options.offset) {
        queryBuilder.offset(options.offset);
      }
      if (options.orderBy) {
        options.orderBy.forEach((order, index) => {
          if (index === 0) {
            queryBuilder.orderBy(order.property, order.direction);
          } else {
            queryBuilder.addOrderBy(order.property, order.direction);
          }
        });
      }
    }

    const result = await queryBuilder.getMany();
    return result;
  }

  async count(where?: Where): Promise<number> {
    await this.init();

    const whereQueryOptions = new WhereConverter().convert(where, this.entityAlias);
    const queryBuilder = this._repository.createQueryBuilder();
    queryBuilder.where(whereQueryOptions.whereClause, whereQueryOptions.whereParameters);

    const result = queryBuilder.getCount();
    return result;
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
