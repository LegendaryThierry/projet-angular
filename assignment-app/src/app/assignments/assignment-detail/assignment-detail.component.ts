import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GradeComponent} from '../../dialog/grade/grade.component';
import {StudentAssignment} from '../../models/studentAssignment';
import {StudentAssignmentsService} from '../../shared/studentAssignments';
import {ConfirmationComponent} from '../../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  // ici c'est une propriété transmises par l'attribut "assignmentTransmis";
  assignmentTransmis: StudentAssignment;
  gradeDialogRef: MatDialogRef<GradeComponent>;
  deleteDialogRef: MatDialogRef<ConfirmationComponent>;

  constructor(
    private dialog: MatDialog,
    private studentAssignmentsService: StudentAssignmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // on récupère l'id dans l'URL, attention par défaut c'est de type string
    // on va devoir le changer en number. Pour cela en typescript il suffit de
    // mettre un "+" devant
    const id = this.route.snapshot.params.id;

    // On recupère l'assignment correspondant à l'id
    this.studentAssignmentsService.getStudentAssignment(id)
    .subscribe(a => {
      this.assignmentTransmis = a;
    });
  }

  /*onAssignmentRendu(): void {
    this.assignmentTransmis.rendu = true;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
    .subscribe(reponse => {
      console.log(reponse.message);
      // et on navigue vers la liste
      this.router.navigate(['/home']);
    });
  }*/

  openGradeDialog(): void{
    this.gradeDialogRef = this.dialog.open(GradeComponent);

    this.gradeDialogRef.afterClosed().subscribe(resultArray => {
      console.log(resultArray);
      if (resultArray !== null){
        this.giveGrade(resultArray[0], resultArray[1]);
      }
    });
  }

  openDeleteDialog(): void{
    this.deleteDialogRef = this.dialog.open(ConfirmationComponent, {
      data:
        {
          question: 'Voulez-vous supprimez le devoir de cet étudiant ?'
        },
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.onDelete();
      }
    });
  }

  giveGrade(grade: number, comment: string): void{
    this.assignmentTransmis.rendu = true;
    this.assignmentTransmis.note = grade;
    this.assignmentTransmis.dateDeRendu = new Date(Date.now());
    this.assignmentTransmis.remarque = comment;

    this.studentAssignmentsService.updateStudentAssignment(this.assignmentTransmis)
      .subscribe(reponse => {
        console.log(reponse.message);
        // et on navigue vers la liste
        this.router.navigate(['/home']);
      });
  }

  onDelete(): void {
    // dans la version précédent ici on prévenait le père par un
    // événement etc. mais maintenant qu'on a un service, pas la peine !
    // on va utiliser directement le service :-)
    this.studentAssignmentsService.deleteStudentAssignment(this.assignmentTransmis)
    .subscribe(response => {
      console.log(response.message);
      this.assignmentTransmis = null;

      // et on navigue vers la liste
      this.router.navigate(['/home']);

    });
  }

  onEdit(): void {
    this.router.navigate(['assignment', this.assignmentTransmis._id, 'edit'],
    {
      queryParams: {nom: this.assignmentTransmis._id},
      fragment: 'edition'
    });
  }
}
