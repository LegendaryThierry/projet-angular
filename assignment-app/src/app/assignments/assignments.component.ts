import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[];

  constructor(private assignmentsService:AssignmentsService) {}

  ngOnInit(): void {
    
    this.assignmentsService.getAssignments()
      .subscribe((assignments:Assignment[]) => {
        // appelé que quand les données sont prêtes
        this.assignments = assignments;
        console.log("données reçues....")
      });

      /* peu utilisé par les devs angular
      this.assignmentsService.getAssignmentsPromise()
      .then(assignments => {
        this.assignments = assignments;
      })
      */
      console.log("données demandées....")
  }
}
