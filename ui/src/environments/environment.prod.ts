const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};
const env: {[name: string]: string} = {};

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {
    env[key] = window['__env'][key];
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
