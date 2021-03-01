import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // champs de formulaire
  dateDeRendu = null;
  nomDevoir = '';

  constructor(private assignmentsService: AssignmentsService,
              private router: Router) {}

  ngOnInit(): void {}

  onSubmit(event): void {
    event.preventDefault();

    // les deux champs sont obligatoires...
    if (!this.nomDevoir) { return; }
    if (!this.dateDeRendu) { return; }

    console.log('Bouton cliqué');
    console.log('Nom = ' + this.nomDevoir);
    console.log('Date = ' + this.dateDeRendu);

    const newAssignment = new Assignment();
    newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = new Date(this.dateDeRendu);
    newAssignment.rendu = false;

    // this.assignments.push(nouvelAssignment);
    // on ne peut accéder au tableau des assignments qui est dans le
    // composant père.... on va devoir trouver un moyen de lui
    // communiquer le nouvel assignment saisi dans le form
    // et lui dire de le rajouter au tableau
    // this.nouvelAssignment.emit(newAssignment);
    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // dire qu'on veut de nouveau afficher la liste
      this.router.navigate(['/home']);
    });
  }
}
