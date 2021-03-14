import {User} from './users.model';
import {Subject} from './subjects.model';
import {Assignment} from './assignment.model';

export class StudentAssignment {
  _id?: string;
  assignment: Assignment;
  dateDeRendu: Date;
  rendu?: boolean;
  eleve: User;
  note: number;
  remarque: string;
}
