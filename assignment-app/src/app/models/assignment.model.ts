import {User} from './users.model';
import {Subject} from './subjects.model';

export class Assignment {
  _id?: string;
  id: number;
  nom: string;
  dateDeRendu: Date;
  rendu?: boolean;
  eleve: User;
  matiere: Subject;
  note: number;
  remarque: string;
}
