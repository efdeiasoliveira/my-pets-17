import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owners } from '../interfaces/owners.model';
import { environment } from '../../../../../environments/environment';
import { Owner } from '../interfaces/owner.model';

@Injectable({
  providedIn: 'root'
})
export class OwnersService {


  constructor(
    private httpClient: HttpClient
  ) { }

  get(page:number,pageSize:number,filter?:string, fields?: string, sort?: string):Observable<Owners>{
    const parameters = new HttpParams()
      .append('page',page)
      .append('pageSize',pageSize)
      .append('filter',filter ? filter : '')
      .append('fields',fields ? fields : '')
      .append('sort',sort ? sort : 'id')


    return this.httpClient.get<Owners>(environment.ownersAPI, { params: parameters });
  }

  getById(id:string):Observable<Owner>{
    return this.httpClient.get<Owner>(environment.ownersAPI + '/' + id) ;
  }

  post(body:Owner): Observable<Owner>{
    return this.httpClient.post<Owner>(environment.ownersAPI, body)
  }

  put(body:Owner): Observable<Owner>{
    return this.httpClient.put<Owner>(environment.ownersAPI + '/' + body.id, body)
  }

  delete(id:string):Observable<any>{
    return this.httpClient.delete<any>(environment.ownersAPI + '/' + id) ;
  }
}
