import { Model, model, property } from '@loopback/repository';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Affiliation } from './affiliation.model';
import { Document } from './document.model';
import { Person } from './person.model';

@Entity()
@model()
export class Member extends Model {
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
  role: string;

  @ManyToOne((type) => Document, (document) => document.members)
  @JoinColumn({ name: 'documentid', referencedColumnName: 'pid' })
  document: Document;

  @property({
    type: 'object',
    required: true
  })
  @ManyToOne((type) => Person, { eager: true })
  @JoinColumn({ name: 'personid', referencedColumnName: 'id' })
  person: Person;

  @property({
    type: 'object',
    required: true
  })
  @ManyToOne((type) => Affiliation, { eager: true })
  @JoinColumn({ name: 'affiliationid', referencedColumnName: 'id' })
  affiliation: Affiliation;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}
