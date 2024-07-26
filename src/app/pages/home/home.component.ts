import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

interface OlympicData {
  country: string;
  participations: Participation[];
}

interface DashboardInformation {
  pieChartData: { name: string; value: number }[];
  countries: number;
  totalOlympics: number;
  generalInformation: { title: string; value: number }[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicData[]>;
  public dashboard$: Observable<DashboardInformation>;
  public view: [number, number] = [400, 500];
  public showLegend = true;
  public colorScheme: Color = {
    domain: ['rgb(25, 25, 112)', 'rgb(31, 81, 255)', 'rgb(167, 199, 231)', 'rgb(204, 204, 255)', 'rgb(150, 222, 209)'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
    this.dashboard$ = this.olympics$.pipe(
      map((data: OlympicData[] | null) => {
        if (!data) {
          console.error('Les données reçues sont undefined ou null');
          return { pieChartData: [], countries: 0, totalOlympics: 0, generalInformation: [] };
        }

        const pieChartData = data.map((item: OlympicData) => ({
          name: item.country,
          value: this.calculateTotalMedals(item.participations),
        }));

        const countries = this.calculateNumberOfCountries(data);
        const totalOlympics = this.calculateTotalOlympics(data);

        const generalInformation = [
          { title: 'Number of JOs', value: totalOlympics },
          { title: 'Number of countries', value: countries },
        ];

        return { pieChartData, countries, totalOlympics, generalInformation };
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        return of({ pieChartData: [], countries: 0, totalOlympics: 0, generalInformation: [] });
      })
    );
  }

  ngOnInit(): void {
    // Aucune souscription ici
  }

  private calculateTotalMedals(participations: Participation[]): number {
    return participations.reduce((total: number, participation: Participation) => {
      return total + participation.medalsCount;
    }, 0);
  }

  private calculateNumberOfCountries(data: OlympicData[]): number {
    return data.length;
  }

  private calculateTotalOlympics(data: OlympicData[]): number {
    return data.reduce((total: number, item: OlympicData) => {
      return total + item.participations.length;
    }, 0);
  }

  onSelect(event: { name: string }): void {
    this.router.navigate(['/details', event.name]);
  }
}
