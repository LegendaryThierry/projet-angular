import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Service de log
export class LoggingService {

  constructor() { }

  log(assignmentName, action): void{
    console.log('Loggin service : Assignment ' + assignmentName + ' ' + action);
  }
}
