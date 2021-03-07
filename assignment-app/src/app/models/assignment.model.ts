import {User} from './users.model';
import {Subject} from './subjects.model';

export class Assignment {
  _id?: string;
  id: number;
  nom: string;
  dateLimite: Date;
  dateDeRendu: Date;
  rendu?: boolean;
  matiere: Subject;
  enseignant: User;
  eleve: User;
  note: number;
  remarque: string;
}
