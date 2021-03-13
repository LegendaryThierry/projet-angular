import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from '../models/assignment.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {User} from '../models/users.model';

export interface AssignmentRow{
  subjectTitle: string;
  assignmentTitle: string;
  teacher: User;
  dateLimite: Date;
}

export interface StudentRow {
  id: number;
  subjectTitle: string;
  assignmentTitle: string;
  student: User;
  teacher: User;
  rendu: boolean;
  dateLimite: Date;
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
  studentAssignments: Assignment[];

  displayedColumnsAssignments: string[] = ['subjectTitle', 'assignmentTitle', 'teacher', 'dateLimite', 'edit', 'delete'];
  displayedColumns: string[] = ['subjectTitle', 'assignmentTitle', 'teacher', 'student', 'rendu', 'dateLimite', 'dateDeRendu', 'note', 'remarque'];
  dataSourceStudent: MatTableDataSource<StudentRow>;
  dataSourceAssignment: MatTableDataSource<AssignmentRow>;
  ELEMENT_DATA_STUDENT: StudentRow[] = [];
  ELEMENT_DATA_ASSIGNMENT: AssignmentRow[] = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private assignmentsService: AssignmentsService, private router: Router) {}

  ngOnInit(): void {

    // Tableau des devoirs
    this.assignmentsService.getDistinctAssignments().subscribe((assignments: Assignment[]) => {
      assignments.forEach(assignment => {
          this.ELEMENT_DATA_ASSIGNMENT.push(
            {
              subjectTitle: assignment.matiere.title,
              assignmentTitle: assignment.nom,
              teacher: assignment.enseignant,
              dateLimite: assignment.dateLimite
            }
          );
        }
      );

      this.dataSourceAssignment = new MatTableDataSource(this.ELEMENT_DATA_ASSIGNMENT);
    });

    // Tableau des devoirs des étudiants
    this.assignmentsService.getAssignments()
      .subscribe((assignments: Assignment[]) => {
        // appelé que quand les données sont prêtes
        this.studentAssignments = assignments;

        this.studentAssignments.forEach(assignment => {
            this.ELEMENT_DATA_STUDENT.push(
              {
                id: assignment.id,
                subjectTitle: assignment.matiere.title,
                assignmentTitle: assignment.nom,
                teacher: assignment.enseignant,
                student: assignment.eleve,
                rendu: assignment.rendu,
                dateLimite: assignment.dateLimite,
                dateDeRendu: assignment.dateDeRendu,
                note: assignment.note,
                remarque: assignment.remarque
              }
            );
        });

        this.dataSourceStudent = new MatTableDataSource(this.ELEMENT_DATA_STUDENT);
        console.log(this.ELEMENT_DATA_STUDENT);
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
    // this.dataSource.sort = this.sort;
  }

  getRecord(row): void{
    this.router.navigate(['/assignment/' + row.id]);
  }
}
