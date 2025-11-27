import { Injectable } from '@angular/core';
import { Observable, retry, catchError } from 'rxjs';
import {BaseService} from '../../shared/services/base.service';
import {Property} from '../model/property.entity';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService extends BaseService<Property> {

  constructor() {
    super();
    this.resourceEndpoint = environment.propertiesEndpointPath;
  }

  getPropertiesBySalesman(salesManId: number): Observable<Property[]> {
    return this.http.get<Property[]>(
      `${this.resourcePath()}/salesman/${salesManId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.resourcePath()}/${id}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
