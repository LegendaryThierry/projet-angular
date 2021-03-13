import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {GradeComponent} from '../../dialog/grade/grade.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  // ici c'est une propriété transmises par l'attribut "assignmentTransmis";
  assignmentTransmis: Assignment;
  gradeDialogRef: MatDialogRef<GradeComponent>;

  constructor(
    private gradeDialog: MatDialog,
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // on récupère l'id dans l'URL, attention par défaut c'est de type string
    // on va devoir le changer en number. Pour cela en typescript il suffit de
    // mettre un "+" devant
    const id = +this.route.snapshot.params.id;

    // On recupère l'assignment correspondant à l'id
    this.assignmentsService.getAssignment(id)
    .subscribe(a => {
      this.assignmentTransmis = a;
      console.log(this.assignmentTransmis);
    });
  }

  onAssignmentRendu(): void {
    this.assignmentTransmis.rendu = true;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
    .subscribe(reponse => {
      console.log(reponse.message);
      // et on navigue vers la liste
      this.router.navigate(['/home']);
    });
  }

  openGradeDialog(): void{
    this.gradeDialogRef = this.gradeDialog.open(GradeComponent);

    this.gradeDialogRef.afterClosed().subscribe(resultArray => {
      console.log(resultArray);
      if (resultArray !== null){
        this.giveGrade(resultArray[0], resultArray[1]);
      }
    });
  }

  giveGrade(grade: number, comment: string): void{
    this.assignmentTransmis.rendu = true;
    this.assignmentTransmis.note = grade;
    this.assignmentTransmis.dateDeRendu = new Date(Date.now());
    this.assignmentTransmis.remarque = comment;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
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
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
    .subscribe(reponse => {
      console.log(reponse.message);
      this.assignmentTransmis = null;

      // et on navigue vers la liste
      this.router.navigate(['/home']);

    });
  }

  onEdit(): void {
    this.router.navigate(['assignment', this.assignmentTransmis.id, 'edit'],
    {
      queryParams: {nom: this.assignmentTransmis.nom},
      fragment: 'edition'
    });
  }
}
