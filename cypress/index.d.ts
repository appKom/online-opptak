declare namespace Cypress {
  interface Chainable<Subject = any> {
    getUserTokens(credentials?: {
      username: string;
      password: string;
    }): Chainable<any>;
    getUserInfo(accessToken: string): Chainable<any>;
    login(credentials?: { username: string; password: string }): Chainable<any>;
    _setAuth0Cookie(encryptedSession: string): Chainable<any>;
    _clearAuth0Cookie(): Chainable<any>;
    _clearAuth0SplittedCookies(): Chainable<any>;
    clearAuth0Cookies(): Chainable<any>;
  }
}
