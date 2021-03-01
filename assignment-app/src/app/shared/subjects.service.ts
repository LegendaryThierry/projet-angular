import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from '../models/subjects.model';
import { LoggingService } from './logging.service';
import {map, tap, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class SubjectsService {
  constructor(private loggingService: LoggingService,
              private http: HttpClient) {}

  url = 'http://localhost:8010/api/subjects';

  getNewId(): number{
    return Math.floor(Math.random() * 100000);
  }

  // Récupération de tous les subjects
  getSubjects(): Observable<Subject[]> {
    // return of(this.subjects);
    return this.http.get<Subject[]>(this.url)
      .pipe(
        catchError(this.handleError<Subject[]>('getSubjects()'))
      );
  }

  // Cherche si un subjects existe dans la base ou pas
  findSubject(title: string): Observable<Subject> {
    const subject = new Subject();
    subject.title = title;

    return this.http.post<Subject>(this.url + '/findSubject', subject);
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation: any, result?: T){
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  addSubject(subject: Subject): Observable<any> {
    return this.http.post<Subject>(this.url, subject);
  }

  updateSubject(subject: Subject): Observable<any> {
    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // return of("SubjectService : Subject modifié !");
    return this.http.put(this.url, subject);
  }

  deleteSubject(subject: Subject): Observable<any> {
    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // let index = this.subjects.indexOf(subjects);
    // this.subjects.splice(index, 1); //pos et nb éléments à supprimer

    // return of("SubjectService : Subject supprimé !");
    return this.http.delete(this.url + '/' + subject._id);
  }

}
