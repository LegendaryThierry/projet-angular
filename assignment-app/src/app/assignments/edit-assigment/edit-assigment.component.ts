import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-edit-assigment',
  templateUrl: './edit-assigment.component.html',
  styleUrls: ['./edit-assigment.component.css']
})
export class EditAssigmentComponent implements OnInit {
  assignment:Assignment;
  // pour les champs du formulaire
  nomAssignment:string;
  dateDeRendu: Date;

  constructor(private route:ActivatedRoute, private router:Router,
    private assignmentsService:AssignmentsService) { }

  ngOnInit(): void {
    let nomPasseDansURL = this.route.snapshot.queryParams.nom;
    let fragmentPasseDansURL = this.route.snapshot.fragment;
    console.log("param nom = " + nomPasseDansURL);
    console.log("fragment = " + fragmentPasseDansURL);

    this.getAssignment();
  }

  getAssignment() {
     // on va récupérer l'id dans la route comme pour le composant d'ajout
    // ne pas oublier le "+" pour le transformer en number (sinon c'est une chaine de caractères)
    let id = +this.route.snapshot.params.id;
    console.log("EDIT id = " + id);

    this.assignmentsService.getAssignment(id)
    .subscribe(a => {
      if(a) {
        this.assignment = a;
        this.nomAssignment = a.nom;
        this.dateDeRendu = a.dateDeRendu;
      }

    });
  }
  onSaveAssignment() {
    // On va modifier l'assignment....
    if(! this.nomAssignment) return;
    if(! this.dateDeRendu) return;

    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;

    this.assignmentsService.updateAssignment(this.assignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // et on navigue vers la liste
      this.router.navigate(["/home"]);
    })
  }

}
