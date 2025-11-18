import { Injectable } from '@angular/core';
import { Client } from '../model/client.entity';
import { Observable, retry, catchError } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService<Client> {

  constructor() {
    super();
    this.resourceEndpoint = environment.clientsEndpointPath;
  }

  getClientsBySalesman(salesManId: number): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.resourcePath()}/salesman/${salesManId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  markPreviousHousing(clientId: number): Observable<Client> {
    return this.http.post<Client>(
      `${this.resourcePath()}/${clientId}/mark-previous-housing`,
      null,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError.bind(this))
    );
  }
}
