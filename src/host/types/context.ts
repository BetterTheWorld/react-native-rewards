export enum UIStateType {
  ShowLoginForm = 'showLoginForm',
  ShowSignUpForm = 'showSignUpForm',
  ShowCountryPicker = 'showCountryPicker',
  ShowTeamForm = 'showTeamForm',
  ShowStore = 'showStore',
  ShowLogout = 'showLogout',
  ShowInitialScreen = 'showInitialScreen',
  ShowForgotPassword = 'showForgotPassword',
  ShowNoInternet = 'showNoInternet',
}

export enum TokenStage {
  empty = 'empty',
  defaultPartner = 'defaultPartner',
  loginAuth = 'personalAuth',
  teamCreationAuth = 'teamAuth',
}

export interface TokenInput {
  token: string;
  stage: TokenStage;
}
