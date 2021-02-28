import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  // ici c'est une propriété transmises par l'attribut "assignmentTransmis"
  assignmentTransmis:Assignment;

  constructor(private assignmentsService:AssignmentsService,
              private route: ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
    // on récupère l'id dans l'URL, attention par défaut c'est de type string
    // on va devoir le changer en number. Pour cela en typescript il suffit de
    // mettre un "+" devant
    let id = +this.route.snapshot.params.id;

    // on va recuperer l'assignment correspondant à l'id
    this.assignmentsService.getAssignment(id)
    .subscribe(a => {
      this.assignmentTransmis = a;
    })
  }

  onAssignmentRendu() {
    this.assignmentTransmis.rendu = true;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
    .subscribe(reponse => {
      console.log(reponse.message);
      // et on navigue vers la liste
      this.router.navigate(["/home"]);
    })
  }

  onDelete() {
    // dans la version précédent ici on prévenait le père par un
    // événement etc. mais maintenant qu'on a un service, pas la peine !
    // on va utiliser directement le service :-)
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
    .subscribe(reponse => {
      console.log(reponse.message);
      this.assignmentTransmis = null;

      // et on navigue vers la liste
      this.router.navigate(["/home"]);

    })
  }

  onEdit() {
    this.router.navigate(['assignment', this.assignmentTransmis.id, 'edit'],
    {
      queryParams: {nom:this.assignmentTransmis.nom},
      fragment:'edition'
    })
  }
}
