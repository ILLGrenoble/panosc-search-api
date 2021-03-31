import { Model, model, property } from '@loopback/repository';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@model()
export class Person extends Model {
  @property({
    type: 'string',
    required: true
  })
  @PrimaryColumn()
  id: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ name: 'fullname' })
  fullName: string;

  @property({
    type: 'string'
  })
  @Column()
  orcid?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'researcherid' })
  researcherId?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'firstname' })
  firstName?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'lastname' })
  lastName?: string;

  constructor(data?: Partial<Person>) {
    super(data);
  }
}
