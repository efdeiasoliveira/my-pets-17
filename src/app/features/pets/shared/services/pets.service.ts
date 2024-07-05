import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pets } from '../interfaces/pets.model';
import { environment } from '../../../../../environments/environment';
import { Pet } from '../interfaces/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {


  constructor(
    private httpClient: HttpClient
  ) { }

  get(page:number,pageSize:number,filter?:string, fields?: string, sort?: string):Observable<Pets>{
    const parameters = new HttpParams()
      .append('page',page)
      .append('pageSize',pageSize)
      .append('filter',filter ? filter : '')
      .append('fields',fields ? fields : '')
      .append('sort',sort ? sort : 'id')


    return this.httpClient.get<Pets>(environment.petsAPI, { params: parameters });
  }

  getById(id:string):Observable<Pet>{
    return this.httpClient.get<Pet>(environment.petsAPI + '/' + id) ;
  }

  post(body:Pet): Observable<Pet>{
    return this.httpClient.post<Pet>(environment.petsAPI, body)
  }

  put(body:Pet): Observable<Pet>{
    return this.httpClient.put<Pet>(environment.petsAPI + '/' + body.id, body)
  }

  delete(id:string):Observable<any>{
    return this.httpClient.delete<any>(environment.petsAPI + '/' + id) ;
  }
}
