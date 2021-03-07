import {User} from './users.model';

export class Subject {
  _id?: string;
  title: string;
  teachers: User[];
}
