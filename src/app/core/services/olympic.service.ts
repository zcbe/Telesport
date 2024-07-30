// Importation des modules nécessaires
import { HttpClient } from '@angular/common/http'; // Service pour effectuer des requêtes HTTP
import { Injectable } from '@angular/core'; // Décorateur pour indiquer que la classe peut être injectée en tant que dépendance
import { BehaviorSubject, take } from 'rxjs'; // Subject de RxJS qui stocke la dernière valeur émise et l'émet aux nouveaux abonnés
import { catchError, tap } from 'rxjs/operators'; // Opérateurs RxJS pour manipuler les flux de données

// Décorateur @Injectable marque cette classe comme pouvant être injectée dans d'autres composants ou services
@Injectable({
  providedIn: 'root', // Le service est disponible au niveau racine, ce qui le rend accessible partout dans l'application
})
export class OlympicService {
  // URL du fichier JSON contenant les données des JO (simule une réponse d'API)
  private olympicUrl = './assets/mock/olympic.json';
  
  // Subject comportemental pour stocker et diffuser les données des JO
  private olympics$ = new BehaviorSubject<any>(undefined);

  // Constructeur du service qui injecte HttpClient pour effectuer des requêtes HTTP
  constructor(private http: HttpClient) {}

  // Méthode pour charger les données initiales depuis le fichier JSON
  loadInitialData() {
    // Utilisation de HttpClient pour faire une requête GET vers l'URL du fichier JSON
    return this.http.get<any>(this.olympicUrl).pipe(
      // tap() permet d'exécuter une action secondaire sans modifier le flux de données
      tap((value) => {
        // Met à jour le Subject avec les nouvelles données
        this.olympics$.next(value);
      }),
      // catchError() permet de gérer les erreurs lors de la récupération des données
      catchError((error, caught) => {
        // Affiche l'erreur dans la console pour le débogage
        console.error(error);
        // Met à jour le Subject avec null pour indiquer un échec de chargement
        this.olympics$.next(null);
        // Retourne l'erreur pour permettre un traitement ultérieur
        return caught;
      }),
      take(1)
    );
  }

  // Méthode pour obtenir les données des JO sous forme d'observable
  getOlympics() {
    // Retourne l'observable du Subject pour que les abonnés puissent recevoir les données
    return this.olympics$.asObservable();
  }
}
