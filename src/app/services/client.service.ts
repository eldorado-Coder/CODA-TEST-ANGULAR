import { Injectable } from '@angular/core';
import { Client } from '../entities/client';
import { MiaBaseCrudHttpService, MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends MiaBaseCrudHttpService<Client> {
  constructor(
    protected http: HttpClient
  ) {
    super(http);
    this.basePathUrl = environment.baseUrl + 'client';
  }

  listOb(query: MiaQuery): Observable<MiaPagination<any>> {
    let params: any = query.toParams();
    //params.access_token = 'aa9676c80bc803b902522459852365847dceb447';
    return this.postOb(this.basePathUrl + '/list', params);
  }

  list(query: MiaQuery): Promise<MiaPagination<any>> {
    return this.listWithExtras(query, { access_token: 'aa9676c80bc803b902522459852365847dceb447' });
  }

  removeOb(itemId: number): Observable<boolean> {
    return this.deleteOb(this.basePathUrl + '/remove/' + itemId);
  }
}