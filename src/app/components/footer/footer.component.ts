import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Définition du composant avec le décorateur @Component
@Component({
  selector: 'app-footer',
  
  // Indique que ce composant est autonome, il n'a pas besoin d'un module parent
  standalone: true,
  
  // Liste des autres composants, directives et pipes importés par ce composant
  imports: [
    RouterLink 
  ],
  
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent {
}
