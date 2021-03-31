import { Model, model, property } from '@loopback/repository';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Document } from './document.model';
import { File } from './file.model';
import { Instrument } from './instrument.model';
import { Parameter } from './parameter.model';
import { Sample } from './sample.model';
import { Technique } from './technique.model';

@Entity()
@model()
export class Dataset extends Model {
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
  title: string;

  @property({
    type: 'boolean',
    required: true
  })
  @Column({ name: 'ispublic', nullable: false })
  isPublic: boolean;

  @property({
    type: 'number',
    required: true
  })
  @Column()
  size?: number;

  @property({
    type: 'date',
    required: true
  })
  @Column({ name: 'creationdate' })
  creationDate?: string;

  @property({
    type: 'number',
    required: true,
    hidden: true
  })
  @Column({ name: 'firstfilenumor', nullable: false })
  firstFileNumor: number;

  @property({
    type: 'number',
    required: true,
    hidden: true
  })
  @Column({ name: 'lastfilenumor', nullable: false })
  lastFileNumor: number;

  @property({
    type: 'string',
    required: true,
    hidden: true
  })
  @Column({ nullable: false })
  path: string;

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

  @ManyToOne((type) => Document)
  @JoinColumn({ name: 'documentid', referencedColumnName: 'pid' })
  document: Document;

  @ManyToOne((type) => Instrument)
  @JoinColumn({ name: 'documentid', referencedColumnName: 'pid' })
  instrument: Instrument;

  @property({
    type: 'array',
    itemType: 'object'
  })
  @OneToMany((type) => File, (file) => file.dataset, {
    eager: true,
    cascade: true
  })
  files: File[];

  @property({
    type: 'array',
    itemType: 'object'
  })
  @OneToMany((type) => Parameter, (parameter) => parameter.dataset, {
    eager: true,
    cascade: true
  })
  parameters: Parameter[];

  @property({
    type: 'array',
    itemType: 'object'
  })
  @ManyToMany((type) => Sample, { eager: true, cascade: true })
  @JoinTable({
    name: 'datasetsample',
    joinColumn: { name: 'datasetid', referencedColumnName: 'pid' },
    inverseJoinColumn: { name: 'sampleid', referencedColumnName: 'pid' }
  })
  samples: Sample[];

  @property({
    type: 'array',
    itemType: 'object'
  })
  @ManyToMany((type) => Technique, { eager: true, cascade: true })
  @JoinTable({
    name: 'datasettechnique',
    joinColumn: { name: 'datasetid', referencedColumnName: 'pid' },
    inverseJoinColumn: { name: 'techniqueid', referencedColumnName: 'pid' }
  })
  techniques: Technique[];

  constructor(data?: Partial<Dataset>) {
    super(data);
  }
}
