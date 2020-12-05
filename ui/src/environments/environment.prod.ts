const browserWindow = window || {};
const envKey = '__env';
const env: {[name: string]: string} = {};

if (envKey in window) {
  const browserWindowEnv = window[envKey as keyof typeof window] as Object;

  for (let [key, value] of Object.entries(browserWindowEnv)) {
    env[key] = value;
  }
}



export const environment = {
  production: true,
  title: 'Production UI',
  openId: {
    issuer: env['openIdIssuer'],
    redirectUri: env['openIdRedirectUri'],
    clientId: env['openIdClientId'],
    responseType: 'code',
    scope: 'openid profile email',
    requireHttps: true,
    showDebugInformation: false,
    disableAtHashCheck: true
  },
  baseHref: env['baseHref']
};
