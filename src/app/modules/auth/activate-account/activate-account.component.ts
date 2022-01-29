import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-activateaccount',
  templateUrl: './activate-account.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})
export class ActivateAccountComponent implements OnInit {
  activated: boolean;

    /**
     * Constructor
     */
     constructor(
      private _authService: AuthService,
      private _route: ActivatedRoute
  )
  {
  }

  ngOnInit(): void {
    this.activateAccount();
  }

  /**
   * Activate account
   */
    activateAccount() {
    const code = this._route.snapshot.queryParamMap.get('code');

    // Activate
    this._authService.activate(code)
        .subscribe(
            (response) => {

                this.activated = response.emailActivated;
            }
        );
  }
}