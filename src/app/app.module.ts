import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule, PieChartModule, TooltipContentComponent } from '@swimlane/ngx-charts';
import { TitleInformationComponent } from './components/title-information/title-information.component';
import { PieChartTooltipComponent } from './components/pie-chart-tooltip/pie-chart-tooltip.component';
import { DetailsComponent } from './pages/detail/details.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    DetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    FooterComponent,
    HeaderComponent,
    PieChartTooltipComponent,
    TitleInformationComponent,
    PieChartModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
