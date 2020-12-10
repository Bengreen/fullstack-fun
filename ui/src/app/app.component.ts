import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, tap } from 'rxjs/operators';
import { authCodeFlowConfig } from './core/auth-code-flow.config';
                                                                                                                        

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.events
      .pipe(
        tap(val => console.log('oauthEvent: ${val}', val)),
        filter(e => e.type === 'token_received'))
      .subscribe(_ => this.oauthService.loadUserProfile());

    
  }
}
