// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import config from '../auth_config.json';

const { domain, clientId, authorizationParams: { audience }, apiUri } = config as {
  domain: string;
  clientId: string;
  authorizationParams: {
    audience?: string;
  },
  apiUri: string;
  // errorPath: string;
  useRefreshTokens: boolean;
  cacheLocation: string
};

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    authorizationParams: {
      ...(audience && audience !== 'YOUR_API_IDENTIFIER' ? { audience } : null),
      redirect_uri: window.location.origin,
      scope: 'openid profile email offline_access'
    },

    useRefreshTokens: true,       // Enable refresh tokens
    cacheLocation: 'localstorage' as const  // Store tokens in localStorage for persistence
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


