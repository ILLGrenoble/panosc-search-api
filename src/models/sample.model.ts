import { Model, model, property } from '@loopback/repository';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@model()
export class Sample extends Model {
  @property({
    type: 'string',
    generated: false
  })
  @PrimaryColumn()
  pid: string;

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
  description?: string;

  constructor(data?: Partial<Sample>) {
    super(data);
  }
}
