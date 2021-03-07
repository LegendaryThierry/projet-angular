import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AssignmentsService} from '../../shared/assignments.service';
import {UsersService} from '../../shared/users.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  hidePassword = true;
  username = '';
  password = '';

  constructor(private dialogRef: MatDialogRef<ConnexionComponent>, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {}

  // Fermer le dialog
  closeDialog(): void{
    this.dialogRef.close(null);
  }

  onSubmit(event): void {
    event.preventDefault();
    // console.log('Username: ' + this.username);
    // console.log('Password: ' + this.password);

    // les deux champs sont obligatoires...
    if (!this.username) { return; }
    if (!this.password) { return; }

    this.usersService.findUser(this.username, this.password).subscribe(user => {
      if (user != null){
        this.dialogRef.close(user);
      }
      else{
        this.closeDialog();
      }
    });
  }
}
