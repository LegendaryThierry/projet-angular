import {User} from './users.model';

export class Subject {
  _id?: string;
  title: string;
  teacher: User;
}
