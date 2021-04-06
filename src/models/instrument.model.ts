import { Model, model, property } from '@loopback/repository';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@model()
export class Instrument extends Model {
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
  name: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ nullable: false })
  facility: string;

  @property({
    type: 'number'
  })
  @Column({ nullable: true })
  score?: number;

  constructor(data?: Partial<Instrument>) {
    super(data);
  }
}
