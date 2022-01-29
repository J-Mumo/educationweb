import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmailActivationResponse, ResendEmailActivationRequest, EmailSentResponse } from './email-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  FORGOTTEN_PASSWORD_EMAIL_URL = '/education/user/email/sendforgottenpasswordemail';
  ACTIVATE_USER_EMAIL_URL = '/education/user/activate';
  RESEND_USER_ACTIVATION_EMAIL_URL = '/education/user/resendactivationemail';
  constructor(private http: HttpClient) { }

  activateUserEmail(emailActivationCode: string): Observable<EmailActivationResponse> {
    return this.http.post(this.ACTIVATE_USER_EMAIL_URL, emailActivationCode, httpOptions).pipe(map(
      (response: EmailActivationResponse) => {
        return response;
      }
    ));
  }

  sendForgottenPasswordEmail(request: ResendEmailActivationRequest): Observable<EmailSentResponse> {
    return this.http.post(
      this.FORGOTTEN_PASSWORD_EMAIL_URL, request, httpOptions).pipe(map(
        (response: EmailSentResponse) => {
          return response;
        }
      ));
  }

  resendActivationEmail(request: ResendEmailActivationRequest): Observable<EmailSentResponse> {
    return this.http.post(
      this.RESEND_USER_ACTIVATION_EMAIL_URL, request, httpOptions).pipe(map(
        (response: EmailSentResponse) => {
          return response;
        }
      ));
  }

}
