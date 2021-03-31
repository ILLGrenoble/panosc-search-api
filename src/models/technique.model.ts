import { Model, model, property } from '@loopback/repository';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@model()
export class Technique extends Model {
  @property({
    type: 'string',
    required: true
  })
  @PrimaryColumn()
  pid: string;

  @property({
    type: 'string'
  })
  @Column({ nullable: false })
  name: string;

  constructor(data?: Partial<Technique>) {
    super(data);
  }
}
