import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {UsersService} from '../../shared/users.service';
import {User} from '../../models/users.model';
import {SubjectsService} from '../../shared/subjects.service';
import {Subject} from '../../models/subjects.model';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // champs de formulaire
  dateDeRendu = null;
  nomDevoir = '';
  subjects = [];
  teachers = [];
  subjectTeachers = [];
  students = [];
  selectedSubject = null;
  selectedTeacher = null;
  selectedStudents = [];

  constructor(private assignmentsService: AssignmentsService, private subjectsService: SubjectsService, private usersService: UsersService,
              private router: Router) {}

  ngOnInit(): void {
    // Récupération de toutes les matières
    this.subjectsService.getSubjects().subscribe((subjects: Subject[]) => {
      this.subjects = subjects;
    });

    // Récupération de tous les utilisateurs
    this.usersService.getUsers().subscribe((users: User[]) => {
      this.teachers = users.filter(user => user.role === 'teacher');
      this.students = users.filter(user => user.role === 'student');
    });
  }

  onSubmit(event): void {
    event.preventDefault();

    console.log('----- Bouton Appuyé -----');
    console.log('Nom = ' + this.nomDevoir);
    console.log('Date = ' + this.dateDeRendu);
    console.log('Matière = ' + this.selectedSubject.title);
    console.log('Professeur = ' + this.selectedTeacher.first_name + ' ' + this.selectedTeacher.last_name);
    console.log('Eleves = ' + this.selectedStudents);

    // Tous les champs sont obligatoires
    if (!this.nomDevoir) { return; }
    if (!this.dateDeRendu) { return; }
    if (!this.selectedSubject) { return; }
    if (!this.selectedTeacher) { return; }

    this.selectedStudents.forEach(student => {
      const newAssignment = new Assignment();
      newAssignment.nom = this.nomDevoir;
      newAssignment.matiere = this.selectedSubject;
      newAssignment.enseignant = this.selectedTeacher;
      newAssignment.eleve = student;
      newAssignment.rendu = false;
      newAssignment.dateDeRendu = new Date(this.dateDeRendu);

      // this.assignments.push(nouvelAssignment);
      // on ne peut accéder au tableau des assignments qui est dans le
      // composant père.... on va devoir trouver un moyen de lui
      // communiquer le nouvel assignment saisi dans le form
      // et lui dire de le rajouter au tableau
      // this.nouvelAssignment.emit(newAssignment);
      this.assignmentsService.addAssignment(newAssignment)
        .subscribe(reponse => {
          console.log(reponse.message);
        });
    });

    // dire qu'on veut de nouveau afficher la liste
    this.router.navigate(['/home']);
  }

  changeSubject(event): void{
    this.selectedSubject = event.value;
    this.selectedTeacher = null;

    this.subjectTeachers = event.value.teachers;
  }

  changeTeacher(event): void{
    this.selectedTeacher = event.value;
  }
}
