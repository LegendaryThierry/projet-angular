import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Assignment } from '../models/assignment.model';
import { LoggingService } from './logging.service';
import {map, tap, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class AssignmentsService {
  constructor(private logginService: LoggingService,
              private http: HttpClient) {}

  /*assignments: Assignment[] = [
    {
      id: 1,
      nom: 'Devoir Angular No1',
      dateDeRendu: new Date('02-20-2021'),
      rendu: false,
    },
    {
      id: 2,
      nom: 'Devoir WebComponent',
      dateDeRendu: new Date('01-26-2021'),
      rendu: true,
    },
    {
      id: 3,
      nom: 'Devoir TLN Elena Cabrio',
      dateDeRendu: new Date('01-30-2021'),
      rendu: false,
    },
  ];*/

  url = 'http://localhost:8010/api/assignments';

  getNewId(): number{
    return Math.floor(Math.random() * 100000);
  }

  getAssignments(): Observable<Assignment[]> {
    // return of(this.assignments);
    return this.http.get<Assignment[]>(this.url)
    .pipe(
      catchError(this.handleError<Assignment[]>('getAssignments()'))
    );
  }

  getDistinctAssignments(): Observable<Assignment[]> {
    // return of(this.assignments);
    return this.http.get<Assignment[]>(this.url + '/distinct')
      .pipe(
        catchError(this.handleError<Assignment[]>('getDistinctAssignments()'))
      );
  }

  // version avec promesse. Peu utilisé par les devs angular
  getAssignmentsPromise(): Promise<Assignment[]> {
    // return of(this.assignments);
    return this.http.get<Assignment[]>(this.url).toPromise();
  }

  getAssignment(id: number): Observable<Assignment> {
    /*
    let a = this.assignments.find(a => a.id === id);

    if(a) {
      this.logginService.log(a.nom, " recherché et trouvé");
    } else {
      this.logginService.log("", "non trouvé");
    }

    return of(a);
    */
   this.logginService.log(' assignment id:' + id, 'recherché via serveur distant');

   return this.http.get<Assignment>(this.url + '/' + id)
   .pipe(
     map(a => {
       return a;
     }),
     tap(a => {
       console.log('TAP : ' + a.nom);
       return a;
     }),
     catchError(this.handleError<Assignment>(`getAssignment(id=${id})`))
   );
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation: any, result?: T){
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  addAssignment(assignment: Assignment): Observable<any> {
    this.logginService.log(assignment.nom, 'a été ajouté....');

    assignment.id = this.getNewId();

    // this.assignments.push(assignment);

    return this.http.post<Assignment>(this.url, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    this.logginService.log(assignment.nom, 'a été modifié....');

    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // return of("AssignmentService : Assignment modifié !");
    return this.http.put(this.url, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    this.logginService.log(assignment.nom, 'a été supprimé....');

    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // let index = this.assignments.indexOf(assignment);
    // this.assignments.splice(index, 1); //pos et nb éléments à supprimer

    // return of("AssignmentService : Assignment supprimé !");
    return this.http.delete(this.url + '/' + assignment._id);
  }

}
