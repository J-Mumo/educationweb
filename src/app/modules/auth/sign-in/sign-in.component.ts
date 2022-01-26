import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/shared/services/user.service';
import { LoggedInUserDetails } from './response';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    authorities: string[];



    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        const email = this.signInForm.value.email;
        const password = this.signInForm.value.password;

        // Sign in
        this._authService.signIn(email, password)
            .subscribe(res => {
                if (res) {
                    this._userService.login(res);
                    this.authorities = this._userService.getAuthorities();
                    this.getLoggedInUser(email);
                }
            });
    }
    getLoggedInUser(email: string) {
        this._authService.getLoginInitialData(email).subscribe((data: LoggedInUserDetails) => {
            this.checkIfEmailIsValid(email);
        });
    }
    checkIfEmailIsValid(email: string) {
        const roles: string[] = this._userService.getAuthorities();
        if (!this.emailValidated(roles)) {
            //navigate to validate email
            this.navigateToValidateEmail(email);

        } else {
            const route = this.navigateToUserDashboard(roles);
            this._router.navigate([route]);
        }
    }
    private navigateToValidateEmail(email: string) {
        this._router.navigate(['/email/validate'],
          { queryParams: { email: email } });
    }
      
    navigateToUserDashboard(roles: string[]) {
        const superadmin = roles.find(x => x === 'SuperAdmin');
        const admin = roles.find(x => x === 'Admin');
        const teacher = roles.find(x => x === 'Teacher');
        if (superadmin) {
            return '/superadmin/dashboard';
        } else if (admin) {
            return '/admin/dashboard';
        } else if (teacher) {
            return '/teacher/dashboard';
        }
    }
    private emailValidated(roles: string[]): boolean {
        if (roles !== undefined) {
            const emailValidated = roles.find(x => x === 'Email Validated');
            if (emailValidated) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}
