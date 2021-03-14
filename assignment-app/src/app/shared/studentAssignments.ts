import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import {map, tap, catchError} from 'rxjs/operators';
import {StudentAssignment} from '../models/studentAssignment';
import {Assignment} from '../models/assignment.model';
import {User} from '../models/users.model';

@Injectable({
  providedIn: 'root'
})


export class StudentAssignmentsService {
  constructor(private logginService: LoggingService,
              private http: HttpClient) {}

  url = 'http://localhost:8010/api/student-assignments';

  getStudentAssignments(): Observable<StudentAssignment[]> {
    // return of(this.assignments);
    return this.http.get<StudentAssignment[]>(this.url)
      .pipe(
        catchError(this.handleError<StudentAssignment[]>('getStudentAssignments()'))
      );
  }

  getStudentAssignment(id: string): Observable<StudentAssignment> {
    return this.http.get<StudentAssignment>(this.url + '/' + id)
      .pipe(
        map(a => {
          return a;
        }),
        tap(a => {
          return a;
        }),
        catchError(this.handleError<StudentAssignment>(`getStudentAssignment(id=${id})`))
      );
  }

  addAssignment(students: User[]): Observable<any> {
    return this.http.post<Assignment>(this.url, students);
  }

  updateStudentAssignment(assignment: StudentAssignment): Observable<any> {
    return this.http.put(this.url, assignment);
  }

  deleteStudentAssignment(assignment: StudentAssignment): Observable<any> {
    return this.http.delete(this.url + '/' + assignment._id);
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation: any, result?: T){
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }
}
