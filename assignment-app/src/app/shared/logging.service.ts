import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(assignmentName, action) {
    console.log("Loggin service : Assignment " + assignmentName + " " + action);
  }
}
