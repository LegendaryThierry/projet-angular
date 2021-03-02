import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from '../models/assignment.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

export interface TableRow {
  subjectTitle: string;
  assignmentTitle: string;
  rendu: boolean;
  dateDeRendu: Date;
  note: number;
  remarque: string;
}

@Component({ // Indique que la classe définie en dessous est un component
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})

export class AssignmentsComponent implements OnInit, AfterViewInit{
  assignments: Assignment[];

  displayedColumns: string[] = ['subjectTitle', 'assignmentTitle', 'rendu', 'dateDeRendu', 'note', 'remarque'];
  dataSource: MatTableDataSource<TableRow>;
  ELEMENT_DATA: TableRow[] = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private assignmentsService: AssignmentsService) {}

  ngOnInit(): void {

    this.assignmentsService.getAssignments()
      .subscribe((assignments: Assignment[]) => {
        // appelé que quand les données sont prêtes
        this.assignments = assignments;

        this.assignments.forEach(assignment => this.ELEMENT_DATA.push(
          {
            subjectTitle: assignment.matiere.title,
            assignmentTitle: assignment.nom,
            dateDeRendu: assignment.dateDeRendu,
            note: assignment.note,
            remarque: assignment.remarque,
            rendu: assignment.rendu
          }
        ));

        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        console.log(assignments);
        console.log(this.ELEMENT_DATA);
      });

    /* peu utilisé par les devs angular
    this.assignmentsService.getAssignmentsPromise()
    .then(assignments => {
      this.assignments = assignments;
    })
    */
    console.log('Données demandées....');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
