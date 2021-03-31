import { Model, model, property } from '@loopback/repository';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@model()
export class Affiliation extends Model {
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
    type: 'string'
  })
  @Column()
  address?: string;

  @property({
    type: 'string'
  })
  @Column()
  city?: string;

  @property({
    type: 'string'
  })
  @Column()
  country?: string;

  constructor(data?: Partial<Affiliation>) {
    super(data);
  }
}
