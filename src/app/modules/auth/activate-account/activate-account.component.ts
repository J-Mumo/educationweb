import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivateEmailRequest, EmailActivationResponse } from '../email-model';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-activateaccount',
  templateUrl: './activate-account.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})
export class ActivateAccountComponent implements OnInit {
  code!: string
  email!: string
  emailActivated!: boolean
  showAlert: boolean = false;

  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
};
  constructor(private emailService: EmailService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.code =  this.activatedRoute.snapshot.queryParamMap.get('code');
    this.email =  this.activatedRoute.snapshot.queryParamMap.get('email');
    this.activateEmail();
  }
  activateEmail(): void{
    const request = new ActivateEmailRequest(
      this.email,
      this.code
    )
    this.emailService.activateUserEmail(this.code)
    .pipe(
      finalize(() => {
          this.showAlert = true;
      })
  )
    .subscribe((res: EmailActivationResponse)=>{
      if(res.emailActivated){
        this.emailActivated = true;
        this.alert = {
          type   : 'success',
          message: 'Your account has been activated.'
      };
      }else{
        this.emailActivated = false;
          // Set the alert
          this.alert = {
            type   : 'error',
            message: res.error
        };
      }
    })
  }
}
function finalize(arg0: () => void): import("rxjs").OperatorFunction<EmailActivationResponse, unknown> {
  throw new Error('Function not implemented.');
}

