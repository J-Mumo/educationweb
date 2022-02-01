import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { RegisterRequest, User } from '../user/user.types';
import { SaveResponseWithId } from 'app/shared/models/response.model';
import { AUTH_TOKEN_PASSWORD, AUTH_TOKEN_USERNAME } from './auth.constant';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(forgotPasswordRequest: { email: string; }): Observable<any>
    {
        return this._httpClient.post('/education/user/sendforgottenpasswordemail', forgotPasswordRequest);
    }

     /**
      * Activate
      *
      * @param accountActivationRequest
    */
    activate(emailActivationCode: string): Observable<any>
    {
        return this._httpClient.post('/education/user/activate', emailActivationCode);
    }
  
    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(resetPasswordRequest : { email: string; passwordResetCode: string; password: string}): Observable<any>
    {
        return this._httpClient.post('/education/user/resetforgottenpassword', resetPasswordRequest);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + btoa(AUTH_TOKEN_USERNAME + ':' + AUTH_TOKEN_PASSWORD)
            })
        };
          
        const body = `username=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}` + `&grant_type=password`;

        return this._httpClient.post('/oauth/token', body, httpOptions).pipe(
            switchMap((response: any) => {
                
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                this.getLoggedInUserDetails();

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Get logged in user details
     */
    getLoggedInUserDetails(): void
    {

        this._httpClient.get('/education/user/loggedinuserdetails').subscribe((response: any) => {
                
                // Store the user on the user service
                const user: User = { firstName: response.firstName,lastName: response.lastName, id: response.id, name:response.name, email:response.email};
                this._userService.update({
                    ...user
                }).subscribe();

            })    
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param RegisterRequest
     */
    signUp(request: RegisterRequest): Observable<SaveResponseWithId>
    {
        return this._httpClient.post<any>('education/school/register', request);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
