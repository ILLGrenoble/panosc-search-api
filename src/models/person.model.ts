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
  @Column({ nullable: true })
  orcid?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'researcherid', nullable: true })
  researcherId?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'firstname', nullable: true })
  firstName?: string;

  @property({
    type: 'string'
  })
  @Column({ name: 'lastname', nullable: true })
  lastName?: string;

  constructor(data?: Partial<Person>) {
    super(data);
  }
}
