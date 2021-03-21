import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GradeComponent} from '../../dialog/grade/grade.component';
import {StudentAssignment} from '../../models/studentAssignment';
import {StudentAssignmentsService} from '../../shared/studentAssignments';
import {ConfirmationComponent} from '../../dialog/confirmation/confirmation.component';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../../models/users.model';

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
  submitDialogRef: MatDialogRef<ConfirmationComponent>;
  user: User;
  remainingTime: { day: number; hour: number; minute: number; seconds: number};
  remainingTimeInMilliseconds: number;

  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog,
    private studentAssignmentsService: StudentAssignmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // on récupère l'id dans l'URL, attention par défaut c'est de type string
    // on va devoir le changer en number. Pour cela en typescript il suffit de
    // mettre un "+" devant

    const user = JSON.parse(this.cookieService.get('UserID'));
    this.user = new User();
    this.user._id = user._id;
    this.user.role = user.role;

    const id = this.route.snapshot.params.id;

    // On recupère l'assignment correspondant à l'id
    this.studentAssignmentsService.getStudentAssignment(id)
    .subscribe(a => {
      this.assignmentTransmis = a;
      if (this.assignmentTransmis.rendu === false){
        // Combien de temps, il lui reste pour rendre le devoir ?
        this.remainingTimeInMilliseconds = this.getRemainingTime(new Date(Date.now()).getTime(),
          new Date(this.assignmentTransmis.assignment.dateLimite).getTime());
        this.remainingTime = this.convertMS(Math.abs(this.remainingTimeInMilliseconds));
      }
      else{
        // Combien de temps, il a rendu le devoir à l'avance ?
        this.remainingTimeInMilliseconds = this.getRemainingTime(new Date(this.assignmentTransmis.dateDeRendu).getTime(),
          new Date(this.assignmentTransmis.assignment.dateLimite).getTime());
        this.remainingTime = this.convertMS(Math.abs(this.remainingTimeInMilliseconds));
      }
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

  openSubmitDialog(): void{
    this.submitDialogRef = this.dialog.open(ConfirmationComponent, {
      data:
        {
          question: 'Voulez-vous envoyer votre devoir ?'
        },
    });

    this.submitDialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.submit();
      }
    });
  }

  submit(): void{
    this.assignmentTransmis.rendu = true;
    this.assignmentTransmis.dateDeRendu = new Date(Date.now());

    this.studentAssignmentsService.updateStudentAssignment(this.assignmentTransmis)
      .subscribe(reponse => {
        console.log(reponse.message);
        // et on navigue vers la liste
        this.router.navigate(['/home']);
      });
  }

  giveGrade(grade: number, comment: string): void{
    this.assignmentTransmis.rendu = true;
    this.assignmentTransmis.note = grade;
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

  getRemainingTime(startDateTime: number, endDateTime: number): number{
    const differenceInMilliseconds = startDateTime - endDateTime;
    return differenceInMilliseconds;
  }

  convertMS( milliseconds: number ): { day: number; hour: number; minute: number; seconds: number} {
    let seconds = Math.floor(milliseconds / 1000);
    let minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hour = Math.floor(minute / 60);
    minute = minute % 60;
    const day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day,
      hour,
      minute,
      seconds
    };
  }
}
