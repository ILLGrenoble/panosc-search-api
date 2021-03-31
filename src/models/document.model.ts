import { Model, model, property } from '@loopback/repository';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Dataset } from './dataset.model';
import { Member } from './member.model';
import { Parameter } from './parameter.model';

@Entity()
@model()
export class Document extends Model {
  @property({
    type: 'string',
    required: true
  })
  @PrimaryColumn()
  pid: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ nullable: false })
  type: string;

  @property({
    type: 'boolean',
    required: true
  })
  @Column({ name: 'ispublic', nullable: false })
  isPublic: boolean;

  @property({
    type: 'string',
    required: true
  })
  @Column({ nullable: false })
  title: string;

  @property({
    type: 'string'
  })
  @Column()
  summary?: string;

  @property({
    type: 'string'
  })
  @Column()
  doi?: string;

  @property({
    type: 'date'
  })
  @Column({ name: 'startdate' })
  startDate?: string;

  @property({
    type: 'date'
  })
  @Column({ name: 'enddate' })
  endDate?: string;

  @property({
    type: 'date'
  })
  @Column({ name: 'releasedate' })
  releaseDate?: string;

  @property({
    type: 'string'
  })
  @Column()
  license?: string;

  @property.array(String, {})
  @Column()
  @Column({ type: 'text', array: true })
  keywords?: string[];

  @property.array(String, {
    required: true,
    hidden: true
  })
  @Column({ type: 'text', array: true, nullable: false })
  acls: string[];

  @property({
    type: 'number'
  })
  @Column()
  score?: number;

  @property({
    type: 'array',
    itemType: 'object'
  })
  @OneToMany((type) => Member, (member) => member.document, {
    eager: true,
    cascade: true
  })
  members: Member[];

  @property({
    type: 'array',
    itemType: 'object'
  })
  @OneToMany((type) => Dataset, (dataset) => dataset.document, {
    eager: true,
    cascade: true
  })
  datasets: Dataset[];

  @property({
    type: 'array',
    itemType: 'object'
  })
  @OneToMany((type) => Parameter, (parameter) => parameter.document, {
    eager: true,
    cascade: true
  })
  parameters: Parameter[];

  constructor(data?: Partial<Document>) {
    super(data);
  }
}
