// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // old vps api
  //test version: orcasmart.me
  // ORCA_API: 'http://18.221.150.95/', ORCA_SHOP_API: 'http://bips.orcasmart.me/',

  // Azure back-end server with SSL Certificate, editted by yali
  // ORCA_API: 'https://www.orcasmart-server.net/', ORCA_SHOP_API: 'http://bips.orcasmart.me/',


  // stable version: orcasmart.us
  // ORCA_API: 'http://18.191.127.123/', ORCA_SHOP_API: 'http://bips.orcasmart.us/',

  //local host:
  //ORCA_API: 'http://127.0.0.1:8000/', ORCA_SHOP_API: 'http://localhost:4200/',

  defaultImg: "assets/images/default.png",
  GOOGLE_MAP_API_KEY: "AIzaSyDreddPJLSQbrjQD9r4kTtmGlvdd0ZNsXA",
  GOOGLE_MAP_API_KEY_BY_SU: "AIzaSyB_03FwtJV1PC8CbZNetMkFvUQIPzsbeKs",
  
  // test environment
  // ORCA_API: 'https://orcasmart-dev.azurewebsites.net/', ORCA_SHOP_API: 'https://orcasmart-dev.azurewebsites.net/',

   //azure back-end server with ssl certificate, editted by simon
  ORCA_API: 'https://orcasmartmeback.azurewebsites.net/', ORCA_SHOP_API: 'https://orcasmartmeback.azurewebsites.net/',

};

