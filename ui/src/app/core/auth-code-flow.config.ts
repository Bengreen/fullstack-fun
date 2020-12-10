import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';


export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
 
  redirectUri: window.location.origin + '/login',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',

  clientId: '232783186720-b05q8racj2e7d4u4fnt7oqf1u93qho0j.apps.googleusercontent.com',

  strictDiscoveryDocumentValidation: false,

  scope: 'openid profile email',

  showDebugInformation: true,
  sessionChecksEnabled: false,

}
