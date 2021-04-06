import { Model, model, property } from '@loopback/repository';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dataset } from './dataset.model';

@Entity()
@model()
export class File extends Model {
  @property({
    type: 'string',
    required: true
  })
  @PrimaryGeneratedColumn()
  id: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ nullable: false })
  name: string;

  @property({
    type: 'string'
  })
  @Column({ nullable: true })
  path?: string;

  @property({
    type: 'number'
  })
  @Column({ nullable: true })
  size?: number;

  @ManyToOne((type) => Dataset)
  @JoinColumn({ name: 'datasetid', referencedColumnName: 'pid' })
  dataset: Dataset;

  constructor(data?: Partial<File>) {
    super(data);
  }
}
