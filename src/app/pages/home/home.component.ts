// Importation des modules nécessaires d'Angular et de RxJS
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Color, ScaleType } from '@swimlane/ngx-charts'; // Importation des types pour les graphiques
import { OlympicService } from 'src/app/core/services/olympic.service'; // Service pour récupérer les données des JO
import { Router } from '@angular/router'; // Service pour la navigation

// Définition de l'interface pour les données de participation
interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

// Définition de l'interface pour les données olympiques par pays
interface OlympicData {
  country: string;
  participations: Participation[];
}

// Définition de l'interface pour les informations du tableau de bord
interface DashboardInformation {
  pieChartData: { name: string; value: number }[];
  countries: number;
  totalOlympics: number;
  generalInformation: { title: string; value: number }[];
}

// Définition du composant Angular
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Déclaration des observables pour les données des JO et du tableau de bord
  public olympics$: Observable<OlympicData[]>;
  public dashboard$: Observable<DashboardInformation>;
  
  // Définition de la taille du graphique
  public view: [number, number] = [400, 500];
  
  // Définition de la visibilité de la légende du graphique
  public showLegend = true;
  
  // Définition du schéma de couleurs pour les graphiques
  public colorScheme: Color = {
    domain: ['rgb(25, 25, 112)', 'rgb(31, 81, 255)', 'rgb(167, 199, 231)', 'rgb(204, 204, 255)', 'rgb(150, 222, 209)'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  // Constructeur du composant, initialisant les propriétés et configurant les observables
  constructor(private olympicService: OlympicService, private router: Router) {
    // Récupération des données des JO via le service
    this.olympics$ = this.olympicService.getOlympics();
    
    // Transformation des données pour le tableau de bord
    this.dashboard$ = this.olympics$.pipe(
      map((data: OlympicData[] | null) => {
        // Gestion des données nulles ou undefined
        if (!data) {
          console.error('Les données reçues sont undefined ou null');
          return { pieChartData: [], countries: 0, totalOlympics: 0, generalInformation: [] };
        }

        // Création des données pour le graphique à secteurs
        const pieChartData = data.map((item: OlympicData) => ({
          name: item.country,
          value: this.calculateTotalMedals(item.participations), // Total des médailles pour chaque pays
        }));

        // Calcul du nombre total de pays et des participations
        const countries = this.calculateNumberOfCountries(data);
        const totalOlympics = this.calculateTotalOlympics(data);

        // Création des informations générales pour le tableau de bord
        const generalInformation = [
          { title: 'Number of JOs', value: totalOlympics },
          { title: 'Number of countries', value: countries },
        ];

        // Retour des informations du tableau de bord
        return { pieChartData, countries, totalOlympics, generalInformation };
      }),
      // Gestion des erreurs lors de la récupération des données
      catchError((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        return of({ pieChartData: [], countries: 0, totalOlympics: 0, generalInformation: [] });
      })
    );
  }

  // Méthode du cycle de vie du composant, appelée lors de l'initialisation
  ngOnInit(): void {
  }

  // Méthode pour calculer le total des médailles pour un pays
  private calculateTotalMedals(participations: Participation[]): number {
    return participations.reduce((total: number, participation: Participation) => {
      return total + participation.medalsCount;
    }, 0);
  }

  // Méthode pour calculer le nombre total de pays
  private calculateNumberOfCountries(data: OlympicData[]): number {
    return data.length;
  }

  // Méthode pour calculer le nombre total de participations aux JO
  private calculateTotalOlympics(data: OlympicData[]): number {
    return data.reduce((total: number, item: OlympicData) => {
      return total + item.participations.length;
    }, 0);
  }

  // Méthode appelée lors de la sélection d'un élément du graphique
  onSelect(event: { name: string }): void {
    // Navigation vers la vue détaillée du pays sélectionné
    this.router.navigate(['/details', event.name]);
  }
}
