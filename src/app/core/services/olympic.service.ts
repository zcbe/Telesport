// Importation des modules nécessaires
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Définition des interfaces pour les types spécifiques
interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}

interface OlympicData {
  country: string;
  participations: Participation[];
}

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicData[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicData[]> {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        return of([]); // Retourner un tableau vide pour correspondre au type Observable<OlympicData[]>
      })
    );
  }

  getOlympics(): Observable<OlympicData[]> {
    return this.olympics$.asObservable().pipe(
      map(data => data || []) // Assurez-vous de retourner un tableau même si les données sont nulles
    );
  }
}

