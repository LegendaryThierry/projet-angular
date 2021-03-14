import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {StudentAssignment} from '../../models/studentAssignment';
import {StudentAssignmentsService} from '../../shared/studentAssignments';

@Component({
  selector: 'app-edit-assigment',
  templateUrl: './edit-student-assigment.component.html',
  styleUrls: ['./edit-student-assigment.component.css']
})
export class EditStudentAssigmentComponent implements OnInit {
  assignment: StudentAssignment;
  // pour les champs du formulaire
  nomAssignment: string;
  dateDeRendu: Date;

  constructor(private route: ActivatedRoute, private router: Router,
              private studentAssignmentsService: StudentAssignmentsService) { }

  ngOnInit(): void {
    const nomPasseDansURL = this.route.snapshot.queryParams.nom;
    const fragmentPasseDansURL = this.route.snapshot.fragment;
    console.log('param nom = ' + nomPasseDansURL);
    console.log('fragment = ' + fragmentPasseDansURL);

    this.getAssignment();
  }

  getAssignment(): void {
     // on va récupérer l'id dans la route comme pour le composant d'ajout
    // ne pas oublier le "+" pour le transformer en number (sinon c'est une chaine de caractères)
    const id = this.route.snapshot.params.id;
    console.log('EDIT id = ' + id);

    this.studentAssignmentsService.getStudentAssignment(id)
    .subscribe(a => {
      if (a) {
        this.assignment = a;
        this.nomAssignment = a.assignment.nom;
        this.dateDeRendu = a.dateDeRendu;
      }

    });
  }
  onSaveAssignment(): void {
    // On va modifier l'assignment....
    if (! this.nomAssignment) { return; }
    if (! this.dateDeRendu) { return; }

    this.assignment.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;

    this.studentAssignmentsService.updateStudentAssignment(this.assignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // et on navigue vers la liste
      this.router.navigate(['/home']);
    });
  }

}
