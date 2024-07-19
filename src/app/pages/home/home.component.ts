import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router'; // Import Router

type DashboardInformation = {
  totalOlympics: number,
  totalCountries: number,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any[]>;
  public pieChartData: any[] = [];
  public view: [number, number] = [700, 400];
  public countries: number = 0;
  public totalOlympics: number = 0;
  public generalInformation: { title: string, value: number }[] = [];
  public showLegend = true;
  public colorScheme: Color = {
    domain: ['rgb(25, 25, 112)', 'rgb(31, 81, 255)', 'rgb(167, 199, 231)','rgb(204, 204, 255)', 'rgb(150, 222, 209)'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  constructor(private olympicService: OlympicService, private router: Router) { // Inject Router
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.olympics$.subscribe(
      (data: any[]) => {
        if (data) {
          // Prepare pie chart data
          this.pieChartData = data.map((item: any) => ({
            name: item.country,
            value: this.calculateTotalMedals(item.participations),
          }));

          // Calculate the number of countries
          this.countries = this.calculateNumberOfCountries(data);

          // Calculate the total number of Olympics
          this.totalOlympics = this.calculateTotalOlympics(data);

          // Prepare general information
          this.generalInformation = [
            { title: 'Number of JOs', value: this.totalOlympics },
            { title: 'Number of countries', value: this.countries },
          ];
        } else {
          console.error('Les données reçues sont undefined ou null');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  private calculateTotalMedals(participations: any[]): number {
    return participations.reduce((total: number, participation: any) => {
      return total + participation.medalsCount;
    }, 0);
  }

  private calculateNumberOfCountries(data: any[]): number {
    return data.length;
  }

  private calculateTotalOlympics(data: any[]): number {
    return data.reduce((total: number, item: any) => {
      return total + item.participations.length; // Assuming each item in participations represents one Olympic event
    }, 0);
  }
}
