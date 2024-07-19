import { Component, Input } from '@angular/core';

// Le décorateur @Component permet de configurer la classe comme un composant Angular
@Component({
  selector: 'app-title-information', // Définir le sélecteur pour utiliser ce composant dans des templates
  standalone: true, // Indique que le composant est autonome, ne nécessite pas d'être déclaré dans un module
  templateUrl: './title-information.component.html', // Chemin vers le fichier HTML du template du composant
  styleUrls: ['./title-information.component.scss'], // Chemin vers le fichier SCSS pour les styles du composant
})
export class TitleInformationComponent {
  // Le décorateur @Input() permet de marquer une propriété comme une entrée, 
  // ce qui signifie qu'elle peut recevoir des valeurs d'un composant parent.
  @Input() title: string = ''; // Propriété d'entrée pour le titre, initialisée avec une chaîne vide par défaut
  @Input() value: number = 0; // Propriété d'entrée pour la valeur, initialisée à 0 par défaut
}
