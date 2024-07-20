import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {PieChartTooltipComponent} from "./components/pie-chart-tooltip/pie-chart-tooltip.component";


// Importation directe du composant autonome, si nécessaire
import { TitleInformationComponent } from './components/title-information/title-information.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    RouterModule,
    CommonModule,
    TitleInformationComponent,
    HeaderComponent,
    FooterComponent,
    PieChartTooltipComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
