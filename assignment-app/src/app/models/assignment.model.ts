import {User} from './users.model';
import {Subject} from './subjects.model';

export class Assignment {
  _id?: string;
  nom: string;
  dateLimite: Date;
  matiere: Subject;
  enseignant: User;
}
