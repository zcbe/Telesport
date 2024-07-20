import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public countryName: string = '';
  public isSelectedCountryValid: boolean = false; // Initialisez comme false
  public numberOfEntries: number = 0;
  public totalNumberMedals: number = 0;
  public totalNumberAthletes: number = 0;
  public lineChartData: any[] = [];
  public view: [number, number] = [700, 400];
  public colorScheme: Color = {
    domain: ['rgb(25, 25, 112)', 'rgb(31, 81, 255)', 'rgb(167, 199, 231)', 'rgb(204, 204, 255)', 'rgb(150, 222, 209)'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
  };
  public generalInformation: { title: string, value: number }[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private routerService: Router
  ) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('countryName') || '';
    console.log('Country Name:', this.countryName); // Debugging line

    // Vérifiez la validité du pays sélectionné
    if (!this.countryName) {
      this.isSelectedCountryValid = false;
      return;
    }

    this.olympicService.getOlympics().subscribe(
      (data: any[]) => {
        const countryData = data.find(item => item.country === this.countryName);
        console.log('Country Data:', countryData); // Debugging line

        if (countryData) {
          this.numberOfEntries = countryData.participations.length;
          this.totalNumberMedals = this.calculateTotalMedals(countryData.participations);
          this.totalNumberAthletes = this.calculateTotalAthletes(countryData.participations);
          this.lineChartData = this.prepareLineChartData(countryData.participations);

          this.generalInformation = [
            { title: 'Number of Entries', value: this.numberOfEntries },
            { title: 'Total Number Medals', value: this.totalNumberMedals },
            { title: 'Total Number of Athletes', value: this.totalNumberAthletes },
          ];

          // Mettez à jour la validité du pays sélectionné
          this.isSelectedCountryValid = true;
        } else {
          console.error('Données non trouvées pour le pays:', this.countryName);
          this.isSelectedCountryValid = false;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
        this.isSelectedCountryValid = false;
      }
    );
  }

  private calculateTotalMedals(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  private calculateTotalAthletes(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  private prepareLineChartData(participations: any[]): any[] {
    return participations.map(participation => ({
      name: participation.year,
      value: participation.medalsCount
    }));
  }

  /**
   * Navigate back to Homepage
   */
  goBackToHomePage(): void {
    this.routerService.navigateByUrl('/');
  }
}
