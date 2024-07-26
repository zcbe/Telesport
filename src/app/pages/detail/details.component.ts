import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Déclaration des interfaces pour les types spécifiques
interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

interface CountryData {
  country: string;
  participations: Participation[];
}

// Déclaration du composant avec les métadonnées
@Component({
  selector: 'app-detail', 
  templateUrl: './details.component.html', 
  styleUrls: ['./details.component.scss'], 
})
export class DetailsComponent implements OnInit, OnDestroy {
  // Déclaration des propriétés publiques utilisées dans le template
  public countryName: string = ''; // Nom du pays sélectionné
  public isSelectedCountryValid: boolean = false; 
  public numberOfEntries: number = 0; 
  public totalNumberMedals: number = 0; 
  public totalNumberAthletes: number = 0; 
  public lineChartData: { name: string, series: { name: number, value: number }[] }[] = []; // Données pour le graphique en ligne
  public view: [number, number] = [400, 500]; 
  public colorScheme: Color = { 
    domain: ['rgb(25, 25, 112)', 'rgb(31, 81, 255)', 'rgb(167, 199, 231)', 'rgb(204, 204, 255)', 'rgb(150, 222, 209)'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
  };
  public generalInformation: { title: string, value: number }[] = []; // Informations générales pour affichage

  private subscription: Subscription = new Subscription();

  // Constructeur pour injecter les services nécessaires
  constructor(
    private olympicService: OlympicService, // Service pour récupérer les données olympiques
    private route: ActivatedRoute, // Service pour gérer les routes et récupérer les paramètres de route
    private routerService: Router // Service pour naviguer entre les routes
  ) {}

  // Méthode appelée après l'initialisation du composant
  ngOnInit(): void {
    // Définition de la taille du graphique en fonction de la taille de la fenêtre
    this.view = [window.innerWidth / 1.3, 400];
    // Récupération du nom du pays à partir des paramètres de la route
    this.countryName = this.route.snapshot.paramMap.get('countryName') || '';
    
    // Si aucun nom de pays n'est trouvé, on marque la sélection comme invalide et on arrête l'exécution
    if (!this.countryName) {
      this.isSelectedCountryValid = false;
      return;
    }

    // Chargement des données olympiques depuis le service
    this.subscription.add(
      this.olympicService.getOlympics().pipe(
        // Utilisation de map pour transformer les données
        map((data: CountryData[] | null) => {
          if (!data) {
            this.isSelectedCountryValid = false;
            return null; // Retourne null si aucune donnée n'est disponible
          }
          
          // Recherche des données du pays sélectionné
          const countryData = data.find(item => item.country === this.countryName);
          if (countryData) {
            // Si les données du pays sont trouvées, on les utilise pour calculer les informations nécessaires
            this.numberOfEntries = countryData.participations.length;
            this.totalNumberMedals = this.calculateTotalMedals(countryData.participations);
            this.totalNumberAthletes = this.calculateTotalAthletes(countryData.participations);
            this.lineChartData = this.prepareLineChartData(countryData.participations);

            // Préparation des informations générales pour affichage
            this.generalInformation = [
              { title: 'Number of Entries', value: this.numberOfEntries },
              { title: 'Total Number Medals', value: this.totalNumberMedals },
              { title: 'Total Number of Athletes', value: this.totalNumberAthletes },
            ];

            // Marquage de la sélection comme valide
            this.isSelectedCountryValid = true;
            return data; // Retourne les données si le pays est trouvé
          } else {
            // Si les données du pays ne sont pas trouvées, on marque la sélection comme invalide
            this.isSelectedCountryValid = false;
            return null; // Retourne null si le pays n'est pas trouvé
          }
        }),
        // Gestion des erreurs
        catchError((error) => {
          console.error('Error loading Olympics data:', error);
          this.isSelectedCountryValid = false;
          return []; // Retourne un tableau vide pour maintenir la continuité du flux
        })
      ).subscribe()
    );
  }

  // Méthode pour calculer le total des médailles à partir des participations
  private calculateTotalMedals(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  // Méthode pour calculer le nombre total d'athlètes à partir des participations
  private calculateTotalAthletes(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  // Méthode pour préparer les données du graphique en ligne à partir des participations
  private prepareLineChartData(participations: Participation[]): { name: string, series: { name: number, value: number }[] }[] {
    return [
      {
        name: 'Medals', 
        series: participations.map(participation => ({
          name: participation.year,
          value: participation.medalsCount 
        }))
      }
    ];
  }

  // Méthode appelée lorsqu'un élément du graphique est sélectionné
  onSelect(event: any): void {
    console.log(event); // Affichage de l'événement dans la console (à des fins de débogage)
  }

  // Méthode pour revenir à la page d'accueil
  goBackToHomePage(): void {
    this.routerService.navigateByUrl('/'); 
  }

  // Méthode pour annuler toutes les souscriptions lorsque le composant est détruit
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
