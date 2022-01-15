import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstituencyTransfer, WardTransfer } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getCountyConstituencies(countyId: number): Observable<ConstituencyTransfer[]>{
    return this.http.get<any>('education/address/constituencies')
  }

  getConstituencyWards(constituencyId: number): Observable<WardTransfer[]>{
    return this.http.get<any>('education/address/wards')
  }
}
