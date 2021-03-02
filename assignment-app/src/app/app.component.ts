import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnexionComponent} from './dialog/connexion/connexion.component';
import {Router} from '@angular/router';
import {UsersService} from "./shared/users.service";
import {SubjectsService} from "./shared/subjects.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assignment App';
  user = null;
  connexionDialogRef: MatDialogRef<ConnexionComponent>; // Référence du Dialog pour pouvoir l'utiliser dans le composant fils

  constructor(private connexionDialog: MatDialog, private router: Router) {}

  openConnexionDialog(): void{
    this.connexionDialogRef = this.connexionDialog.open(ConnexionComponent);

    this.connexionDialogRef.afterClosed().subscribe(user => {
      this.user = user;
      console.log(user);
    });
  }

  disconnect(): void{
    this.user = null;
    this.router.navigate(['/']);
  }
}
