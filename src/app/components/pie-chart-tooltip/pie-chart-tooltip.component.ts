import { Component, Input } from '@angular/core';

// Définition du composant avec le décorateur @Component
@Component({
  selector: 'app-pie-chart-tooltip',
  
  // Indique que ce composant est autonome, il n'a pas besoin d'un module parent
  standalone: true,
  
  imports: [],
  templateUrl: './pie-chart-tooltip.component.html',
  styleUrl: './pie-chart-tooltip.component.scss'
})

// Définition de la classe du composant PieChartTooltipComponent
export class PieChartTooltipComponent {
  // Définition des propriétés d'entrée (Input) pour le composant
  // `@Input` permet de passer des données de l'extérieur au composant
  @Input() country: string = ''; // Nom du pays
  @Input() medals: number = 0;   // Nombre de médailles
}
