import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { RegisterRequest } from 'app/core/user/user.types';
import { ConstituencyTransfer, WardTransfer } from 'app/shared/models/address.model';
import { RegisterSchoolInitialData } from 'app/shared/models/school.model';
import { AddressService } from 'app/shared/services/address.service';
import { SchoolService } from 'app/shared/services/school.service';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    @ViewChild('userSignUpNgForm') userSignUpNgForm: NgForm;
    isLinear = false
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    userForm: FormGroup;
    signUpForm: FormGroup;
    schoolForm: FormGroup;
    addressForm: FormGroup;
    agreementForm: FormGroup;
    showAlert: boolean = false;
    longitude: string
    latitude: string

    data: RegisterSchoolInitialData
    constituencies: ConstituencyTransfer[]
    wards: WardTransfer[]

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _addressService: AddressService,
        private _schoolService: SchoolService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            phone: ['', Validators.required]

        })

        this.agreementForm = this._formBuilder.group({
            agreements: ['', Validators.required]
        })

        this.addressForm = this._formBuilder.group({
            county: ['', Validators.required],
            constituency: ['', Validators.required],
            ward: ['', Validators.required],
            firstLine: ['', Validators.required],
            secondLine: ['', Validators.required]
        })

        this.schoolForm = this._formBuilder.group({
            schoolName: ['', Validators.required],
            description: [''],
            schoolLevelId: ['', Validators.required],
            schoolTypeId: ['', Validators.required]
        })

        // Create the form
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                phone  : ['', Validators.required],
                school   : ['', Validators.required],
                agreements: ['', Validators.requiredTrue]
            }
        );
        

        this.getRegisterInitialData();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getRegisterInitialData(){
        this._schoolService.getRegisterSchoolInitialData().subscribe((res: RegisterSchoolInitialData)=>{
            this.data = res;
        })
    }

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.userForm.invalid  && this.addressForm.invalid && this.agreementForm.invalid && this.schoolForm.invalid)
        {
            return;
        }

        // Disable the form
        this.userForm.disable();
        this.addressForm.disable();
        this.schoolForm.disable();
        this.agreementForm.disable();
        // Hide the alert
        this.showAlert = false;

        const request = new RegisterRequest(
            this.userForm.value.firstName,
            this.userForm.value.lastName,
            this.userForm.value.phone,
            this.userForm.value.email,
            this.schoolForm.value.schoolName,
            this.addressForm.value.ward,
            this.addressForm.value.firstLine,
            this.addressForm.value.secondLine,
            this.longitude,
            this.latitude,
            this.schoolForm.value.schoolTypeId,
            this.schoolForm.value.schoolLevelId,
            this.schoolForm.value.description

        )
        // Sign up
        this._authService.signUp(request)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                },
                (response) => {
                    // Re-enable the form
                    this.userForm.enable();
                    this.schoolForm.enable();
                    this.schoolForm.enable();
                    this.addressForm.enable();
                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };
                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    getCountyConstituencies(e: any){
        const countyId = e.value;
        console.log("CountyId: " + countyId)
        this._addressService.getCountyConstituencies(countyId).subscribe((res: ConstituencyTransfer[])=>{
            this.constituencies= res
        })
    }

    getConstituencyWards(e: any){
        const constituencyId =e.value;
        this._addressService.getConstituencyWards(constituencyId).subscribe((res: WardTransfer[])=>{
            this.wards = res
        })
    }
}
