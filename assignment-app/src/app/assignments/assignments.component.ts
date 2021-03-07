import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from '../models/assignment.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {User} from '../models/users.model';

export interface TableRow {
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
  assignments: Assignment[];

  displayedColumns: string[] = ['subjectTitle', 'assignmentTitle', 'teacher', 'student', 'rendu', 'dateLimite', 'dateDeRendu', 'note', 'remarque'];
  dataSource: MatTableDataSource<TableRow>;
  ELEMENT_DATA: TableRow[] = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private assignmentsService: AssignmentsService, private router: Router) {}

  ngOnInit(): void {

    this.assignmentsService.getAssignments()
      .subscribe((assignments: Assignment[]) => {
        // appelé que quand les données sont prêtes
        this.assignments = assignments;

        this.assignments.forEach(assignment => {
            this.ELEMENT_DATA.push(
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
    // this.dataSource.sort = this.sort;
  }

  getRecord(row): void{
    this.router.navigate(['/assignment/' + row.id]);
  }
}
