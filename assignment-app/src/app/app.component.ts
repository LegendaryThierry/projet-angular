import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnexionComponent} from './dialog/connexion/connexion.component';
import {NavigationEnd, Router} from '@angular/router';
import {ThemeService} from './theme/theme.service';
import {CookieService} from 'ngx-cookie-service';
import {User} from './models/users.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Assignment App';
  currentRoute = '';
  connexionDialogRef: MatDialogRef<ConnexionComponent>; // Référence du Dialog pour pouvoir l'utiliser dans le composant fils
  user: User;

  constructor(private cookieService: CookieService, private connexionDialog: MatDialog,
              private router: Router, private themeService: ThemeService) {}

  // Utilisé pour activer ou désactiver le dark mode
  toggle(): void {
    const active = this.themeService.getActiveTheme() ;
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }

  // Ouverture du dialog pour se connecter
  openConnexionDialog(): void{
    this.connexionDialogRef = this.connexionDialog.open(ConnexionComponent);

    this.connexionDialogRef.afterClosed().subscribe(user => {
      if (user !== null){
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        this.cookieService.set( 'UserID', JSON.stringify(user), expiredDate);
        this.getUserInfo(JSON.stringify(user));
        this.router.navigate(['/home']); // On redirige l'utilisateur si la connexion a réussi
      }
    });
  }

  // Construction d'un objet User à partir d'un JSON
  getUserInfo(jsonString: string): void{
      const json = JSON.parse(jsonString);
      this.user = new User();
      this.user._id = json._id;
      this.user.first_name = json.first_name;
      this.user.last_name = json.last_name;
      this.user.picture = json.picture;
  }

  // Déconnexion de l'utilisateur
  disconnect(): void{
    this.cookieService.delete('UserID');
    this.user = undefined;
    this.router.navigate(['/']);
  }

  // Redirection de l'utilisateur vers la page d'accueil s'il n'est pas connecté. Désactivé lors du développement
  ngOnInit(): void {
    // Nous checkons l'existence du cookie afin de retrouver les informations de l'utilisateur
    if (this.user === undefined){
      const jsonString = this.cookieService.get('UserID');
      if (jsonString !== '' && jsonString !== 'undefined') {
        this.getUserInfo(jsonString);
      }
    }

    this.router.events.subscribe(event =>
      {
        if (event instanceof NavigationEnd){
          if ((this.user === null || this.user === undefined) && event.url !== '/'){
            this.router.navigate(['/']);
          }
        }
      });
  }
}
