import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from '../models/assignment.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {User} from '../models/users.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {EditAssignmentComponent} from '../dialog/edit-assignment/edit-assignment.component';
import {StudentAssignmentsService} from '../shared/studentAssignments';
import {StudentAssignment} from '../models/studentAssignment';
import {ConfirmationComponent} from '../dialog/confirmation/confirmation.component';
import {CookieService} from 'ngx-cookie-service';

export interface AssignmentRow{
  _id: string;
  subjectTitle: string;
  assignmentTitle: string;
  teacher: User;
  dateLimite: Date;
}

export interface StudentAssignmentRow {
  id: string;
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
  displayedColumnsAssignments: string[] = ['subjectTitle', 'assignmentTitle', 'teacher', 'dateLimite', 'edit', 'delete'];
  displayedColumns: string[] = ['subjectTitle', 'assignmentTitle', 'teacher', 'student', 'rendu', 'dateLimite', 'dateDeRendu', 'note', 'remarque'];
  dataSourceNotSubmited: MatTableDataSource<StudentAssignmentRow>;
  dataSourceSubmited: MatTableDataSource<StudentAssignmentRow>;
  dataSourceAssignment: MatTableDataSource<AssignmentRow>;
  assignments: Assignment[];
  ELEMENT_DATA_SUBMITED: StudentAssignmentRow[] = [];
  ELEMENT_DATA_NOT_SUBMITED: StudentAssignmentRow[] = [];
  ELEMENT_DATA_ASSIGNMENT: AssignmentRow[] = [];
  editAssignmentDialogRef: MatDialogRef<EditAssignmentComponent>;
  deleteAssignmentDialogRef: MatDialogRef<ConfirmationComponent>;
  user: User;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cookieService: CookieService, private dialog: MatDialog, private assignmentsService: AssignmentsService,
    private studentAssignmentsService: StudentAssignmentsService, private router: Router) {}

  // Récupération et tri de tous les assignments
  ngOnInit(): void {
    // Récupération des informations de l'utilisateur à partir du cookie généré lors de sa connexion
    const user = JSON.parse(this.cookieService.get('UserID'));
    this.user = new User();
    this.user._id = user._id;
    this.user.role = user.role;

    // Tableau des devoirs
    this.assignmentsService.getAssignments().subscribe((assignments: Assignment[]) => {

      if (this.user.role === 'teacher'){
        assignments = assignments.filter(x => x.enseignant._id === this.user._id);
      }

      assignments.forEach(assignment => {
          this.ELEMENT_DATA_ASSIGNMENT.push(
            {
              _id: assignment._id,
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
    this.studentAssignmentsService.getStudentAssignments()
      .subscribe((studentAssignments: StudentAssignment[]) => {

        if (this.user.role === 'student'){
          studentAssignments = studentAssignments.filter(x => x.eleve._id === this.user._id);
        }
        else if (this.user.role === 'teacher'){
          studentAssignments = studentAssignments.filter(x => x.assignment.enseignant._id === this.user._id);
        }

        // appelé que quand les données sont prêtes
        studentAssignments.forEach(studentAssignment => {
            if (studentAssignment.rendu === true){
              this.ELEMENT_DATA_SUBMITED.push(
                {
                  id: studentAssignment._id,
                  subjectTitle: studentAssignment.assignment.matiere.title,
                  assignmentTitle: studentAssignment.assignment.nom,
                  teacher: studentAssignment.assignment.enseignant,
                  student: studentAssignment.eleve,
                  rendu: studentAssignment.rendu,
                  dateLimite: studentAssignment.assignment.dateLimite,
                  dateDeRendu: studentAssignment.dateDeRendu,
                  note: studentAssignment.note,
                  remarque: studentAssignment.remarque
                }
              );
            }
            else{
              this.ELEMENT_DATA_NOT_SUBMITED.push(
                {
                  id: studentAssignment._id,
                  subjectTitle: studentAssignment.assignment.matiere.title,
                  assignmentTitle: studentAssignment.assignment.nom,
                  teacher: studentAssignment.assignment.enseignant,
                  student: studentAssignment.eleve,
                  rendu: studentAssignment.rendu,
                  dateLimite: studentAssignment.assignment.dateLimite,
                  dateDeRendu: studentAssignment.dateDeRendu,
                  note: studentAssignment.note,
                  remarque: studentAssignment.remarque
                }
              );
            }
        });

        this.dataSourceNotSubmited = new MatTableDataSource(this.ELEMENT_DATA_NOT_SUBMITED);
        this.dataSourceSubmited = new MatTableDataSource(this.ELEMENT_DATA_SUBMITED);
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

  // Ouverture du dialog pour éditer un Assignment
  openEditAssignmentDialog(row): void{
    this.editAssignmentDialogRef = this.dialog.open(EditAssignmentComponent, {
      data:
        {
          assignmentTitle: row.assignmentTitle,
          dateLimite: row.dateLimite
        },
    });

    this.editAssignmentDialogRef.afterClosed().subscribe(data => {
      if (data !== null){
        const editedAssignment = this.assignments.filter(assignment => assignment._id === row._id)[0];
        editedAssignment.nom = data.assignmentTitle;
        editedAssignment.dateLimite = data.dateLimite;

        console.log(editedAssignment);

        const dataToSend = {
          _id: editedAssignment._id,
          nom: data.assignmentTitle,
          dateLimite: data.dateLimite,
          matiere: editedAssignment.matiere._id,
          enseignant: editedAssignment.enseignant._id
        };

        this.assignmentsService.updateAssignment(dataToSend).subscribe( result => {
          window.location.reload();
        });
      }
    });
  }

  // Ouverture du dialog de confirmation pour supprimer un Assignment
  openDeleteAssignmentDialog(row): void{
    this.deleteAssignmentDialogRef = this.dialog.open(ConfirmationComponent, {
      data:
        {
          question: 'Voulez-vous supprimez ce composant ?'
        },
    });

    this.deleteAssignmentDialogRef.afterClosed().subscribe(data => {
      if (data === true){
        const assignmentToDelete = this.assignments.filter(assignment => assignment._id === row._id)[0];
        this.assignmentsService.deleteAssignment(assignmentToDelete).subscribe(result => {
            window.location.reload();
          }
        );
      }
    });
  }

  editStudentAssignment(row): void{
    this.router.navigate(['/assignment/' + row.id]);
  }

  // Comparaison entre 2 dates
  isAssignmentInTime(dateLimite: string): boolean{
    const a = new Date(Date.now());
    const b = new Date(dateLimite);
    return a <= b;
  }
}
