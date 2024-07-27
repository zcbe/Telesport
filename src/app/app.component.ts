import { Component, OnInit } from '@angular/core'; // Import des décorateurs et interfaces Angular
import { take } from 'rxjs'; // Import de l'opérateur 'take' de RxJS
import { OlympicService } from './core/services/olympic.service'; // Import du service personnalisé 'OlympicService'

@Component({
  // Définition du sélecteur, du modèle HTML et du fichier de style pour le composant
  selector: 'app-root', 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.scss'], 
})
export class AppComponent implements OnInit {
  // Déclaration du constructeur du composant
  constructor(private olympicService: OlympicService) {} // Injection du service 'OlympicService' dans le constructeur

  // Implémentation de la méthode 'ngOnInit' de l'interface OnInit
  ngOnInit(): void {
    // Appel de la méthode 'loadInitialData' du service lors de l'initialisation du composant
    this.olympicService.loadInitialData()
      .pipe(take(1)) // Utilisation de l'opérateur 'take' pour ne prendre qu'une seule valeur et compléter
      .subscribe(); // Souscription à l'observable retourné par 'loadInitialData'
  }
}
