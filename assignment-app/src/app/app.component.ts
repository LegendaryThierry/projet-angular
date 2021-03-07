import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnexionComponent} from './dialog/connexion/connexion.component';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Assignment App';
  user = null;
  currentRoute = '';
  connexionDialogRef: MatDialogRef<ConnexionComponent>; // Référence du Dialog pour pouvoir l'utiliser dans le composant fils

  constructor(private connexionDialog: MatDialog, private router: Router) {}

  openConnexionDialog(): void{
    this.connexionDialogRef = this.connexionDialog.open(ConnexionComponent);

    this.connexionDialogRef.afterClosed().subscribe(user => {
      this.user = user;
      console.log(user);
      if (this.user !== null){
        this.router.navigate(['/home']); // On redirige l'utilisateur si la connexion a réussi
      }
    });
  }

  disconnect(): void{
    this.user = null;
    this.router.navigate(['/']);
  }

  // Redirection de l'utilisateur vers la page d'accueil s'il n'est pas connecté. Désactivé lors du développement
  ngOnInit(): void {
    // this.router.events.subscribe(event =>
    //   {
    //     if (event instanceof NavigationEnd){
    //       if (this.user == null && event.url !== '/'){
    //         this.router.navigate(['/']);
    //       }
    //     }
    //   });
    }
}
