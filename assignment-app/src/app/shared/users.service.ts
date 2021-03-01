import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/users.model';
import { LoggingService } from './logging.service';
import {map, tap, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class UsersService {
  constructor(private loggingService: LoggingService,
              private http: HttpClient) {}

  url = 'http://localhost:8010/api/users';

  getNewId(): number{
    return Math.floor(Math.random() * 100000);
  }

  // Récupération de tous les users
  getUsers(): Observable<User[]> {
    // return of(this.users);
    return this.http.get<User[]>(this.url)
      .pipe(
        catchError(this.handleError<User[]>('getUsers()'))
      );
  }

  // Cherche si un users existe dans la base ou pas
  findUser(username: string, password: string): Observable<User> {
    const user = new User();
    user.username = username;
    user.password = password;

    return this.http.post<User>(this.url + '/findUser', user);
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation: any, result?: T){
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  addUser(user: User): Observable<any> {
    return this.http.post<User>(this.url, user);
  }

  updateUser(user: User): Observable<any> {
    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // return of("UserService : User modifié !");
    return this.http.put(this.url, user);
  }

  deleteUser(user: User): Observable<any> {
    // par la suite on rajoutera du code pour modifier
    // dans une base de données distante.
    // let index = this.users.indexOf(users);
    // this.users.splice(index, 1); //pos et nb éléments à supprimer

    // return of("UserService : User supprimé !");
    return this.http.delete(this.url + '/' + user._id);
  }

}
