import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterSchoolInitialData } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getRegisterSchoolInitialData(): Observable<RegisterSchoolInitialData>{
    return this.http.get<any>('education/school/register/data')
  }


}
