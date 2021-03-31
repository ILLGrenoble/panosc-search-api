import { Model, model, property } from '@loopback/repository';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dataset } from './dataset.model';
import { Document } from './document.model';

@Entity()
@model()
export class Parameter extends Model {
  @property({
    type: 'number',
    required: true
  })
  @PrimaryGeneratedColumn()
  id: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ nullable: false })
  name: string;

  @property({
    required: true
  })
  @Column({ type: 'text', nullable: false })
  value: number | string;

  @property({
    type: 'string'
  })
  @Column()
  unit?: string;

  @ManyToOne((type) => Document, (document) => document.parameters)
  @JoinColumn({ name: 'documentid', referencedColumnName: 'pid' })
  document: Document;

  @ManyToOne((type) => Dataset)
  @JoinColumn({ name: 'datasetid', referencedColumnName: 'pid' })
  dataset: Dataset;

  constructor(data?: Partial<Parameter>) {
    super(data);
  }
}
