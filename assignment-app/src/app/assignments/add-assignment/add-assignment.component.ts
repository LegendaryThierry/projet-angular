import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../../models/assignment.model';
import {UsersService} from '../../shared/users.service';
import {User} from '../../models/users.model';
import {SubjectsService} from '../../shared/subjects.service';
import {Subject} from '../../models/subjects.model';
import {StudentAssignmentsService} from '../../shared/studentAssignments';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // champs de formulaire
  dateLimite = null;
  nomDevoir = '';
  subjects = [];
  teachers = [];
  subjectTeachers = [];
  students = [];
  selectedSubject = null;
  selectedTeacher = null;
  selectedStudents = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  @ViewChild('selectSubject') selectSubject: MatSelect;
  @ViewChild('selectTeacher') selectTeacher: MatSelect;

  constructor(private formBuilder: FormBuilder, private assignmentsService: AssignmentsService,
              private studentAssignmentsService: StudentAssignmentsService,
              private subjectsService: SubjectsService,
              private usersService: UsersService, private router: Router) {}

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
    console.log('Date = ' + this.dateLimite);
    console.log('Matière = ' + this.selectedSubject.title);
    console.log('Professeur = ' + this.selectedTeacher.first_name + ' ' + this.selectedTeacher.last_name);
    console.log('Eleves = ' + this.selectedStudents);

    // Tous les champs sont obligatoires
    if (!this.nomDevoir) { return; }
    if (!this.dateLimite) { return; }
    if (!this.selectedSubject) { return; }
    if (!this.selectedTeacher) { return; }

    const newAssignment = new Assignment();
    newAssignment.nom = this.nomDevoir;
    newAssignment.matiere = this.selectedSubject;
    newAssignment.enseignant = this.selectedTeacher;
    newAssignment.dateLimite = new Date(this.dateLimite);

    const data = {
      assignment: newAssignment,
      students: this.selectedStudents
    };

    this.assignmentsService.addAssignment(data)
      .subscribe(response => {
        console.log(response.message);
        // dire qu'on veut de nouveau afficher la liste
        this.router.navigate(['/home']);
      });
  }

  changeSubject(event): void{
    this.selectedSubject = event.value;
    this.selectedTeacher = null;

    this.subjectTeachers = event.value.teachers;
  }

  changeTeacher(event): void{
    this.selectedTeacher = event.value;
  }

  reset(event): void{
    this.nomDevoir = null;
    this.dateLimite = '';
    this.selectedSubject = null;
    this.selectedTeacher = null;
    this.selectedStudents = [];

    this.selectSubject.value = null;
    this.selectTeacher.value = null;
  }
}
