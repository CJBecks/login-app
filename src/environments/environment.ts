// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cognito: {
    userPoolId: 'us-east-1_bqgaiMpmz',
    userPoolWebClientId: '5tiggfvlbr6i5vgbsme33bs6v7',
  },
  api: {
    protectedEndpoint: 'https://dzdggqurla.execute-api.us-east-1.amazonaws.com/',
    userApi: 'https://miz1dk8yi6.execute-api.us-east-1.amazonaws.com/prod/user'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
