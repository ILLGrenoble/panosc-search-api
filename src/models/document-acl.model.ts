import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Document } from './document.model';
import { Person } from './person.model';

@Entity({ name: 'documentacl' })
export class DocumentAcl {
  @PrimaryColumn()
  documentid: string;

  @PrimaryColumn()
  personid: string;

  @ManyToOne((type) => Document)
  @JoinColumn({ name: 'documentid', referencedColumnName: 'pid' })
  document: Document;

  @ManyToOne((type) => Person)
  @JoinColumn({ name: 'personid', referencedColumnName: 'id' })
  person: Person;
}
