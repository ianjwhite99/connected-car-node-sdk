import {URLSearchParams} from 'url';
import {ConnectedCarException} from '../Exceptions/ConnectedCarException';
import {AccessToken} from './AccessToken';
import pkceChallenge from 'pkce-challenge';
import axios, {AxiosInstance} from 'axios';
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';

export interface OAuthRequestInterface {
  client_id: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
  grant_id: string;
  code_verifier: string;
  refresh_token?: string;
}

export interface AuthInterface {
  username: string;
  password: string;
}

/**
 * @class OAuth2Client
 */
export class OAuth2Client {
  private clientId: string;

  private region: string;

  private regions = {
    US: '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
    CA: '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
    EU: '1E8C7794-FF5F-49BC-9596-A1E0C86C5B19',
    AU: '5C80A6BB-CF0D-4A30-BDBF-FC804B5C1A98',
  };

  constructor(clientId: string, region = 'US') {
    this.clientId = clientId;
    this.region = this.regions[region];
  }

  /**
   * Get a new access token from credentials
   * @param auth AuthInterface
   * @returns accessToken
   */
  public async getAccessTokenFromCredentials(auth: AuthInterface): Promise<AccessToken> {
    const jar = new CookieJar();
    const client = wrapper(axios.create({jar}));
    const pkce = pkceChallenge();

    const webSession: {code: string; grantId: string} = await this.initalizeWebSession(
      client,
      pkce.code_challenge
    )
      .then(async (authURL: string) => {
        return this.attemptLogin(authURL, auth, client).then(async (url: string) => {
          return this.fetchAuthorizationCode(url, client).then(
            (data: {code: string; grantId: string}) => data
          );
        });
      })
      .catch(err => {
        throw err;
      });

    const data: OAuthRequestInterface = {
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code: webSession.code,
      redirect_uri: 'fordapp://userauthorized',
      grant_id: webSession.grantId,
      code_verifier: pkce.code_verifier,
    };

    return await this.requestAccessToken(data);
  }

  /**
   * Grab the authorized redirect link from the html page
   * @param client AxiosInstance
   * @param code_challenge string
   * @returns {<Promise<string>>}
   */
  private async initalizeWebSession(
    client: AxiosInstance,
    code_challenge: string
  ): Promise<string> {
    return client
      .get(
        `https://sso.ci.ford.com/v1.0/endpoint/default/authorize?redirect_uri=fordapp://userauthorized&response_type=code&scope=openid&max_age=3600&client_id=9fb503e0-715b-47e8-adfd-ad4b7770f73b&code_challenge=${code_challenge}%3D&code_challenge_method=S256`,
        {
          headers: {
            ...this.getDefaultHeaders(),
          },
        }
      )
      .then(async res => {
        if (res.status === 200) {
          const authURL =
            'https://sso.ci.ford.com' +
            this.findRegexMatch(/data-ibm-login-url="(.*)" /gm, res.data);
          if (authURL) return authURL;
          throw new Error('Could not find auth URL');
        }
        throw new Error('Initialize WebSession: Unhandled success status code');
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Attempt to login and gain authorized redirect URL
   * @param url string
   * @param auth AuthInterface
   * @param client AxiosInstance
   * @returns {Promise<string>}
   */
  private async attemptLogin(
    url: string,
    auth: AuthInterface,
    client: AxiosInstance
  ): Promise<string> {
    return client
      .post(
        url,
        new URLSearchParams({
          operation: 'verify',
          'login-form-type': 'pwd',
          username: auth.username,
          password: auth.password,
        }).toString(),
        {
          maxRedirects: 0,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...this.getDefaultHeaders(),
          },
        }
      )
      .then(() => {
        throw new Error('Attempt Login: Unhandled success status code');
      })
      .catch(err => {
        if (err.response.status === 302) {
          return err.response.headers.location;
        }
        throw new Error('Attempt Login: Unhandled Error Code');
      });
  }

  /**
   * Fetch Code & Grant ID
   * @param url string
   * @param client AxiosInstance
   * @returns {<Promise<{code: string; grantId: string}>>}
   */
  private async fetchAuthorizationCode(
    url: string,
    client: AxiosInstance
  ): Promise<{code: string; grantId: string}> {
    return client
      .get(url, {
        maxRedirects: 0,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...this.getDefaultHeaders(),
        },
      })
      .then(() => {
        throw new Error('Fetch Authorization Code: Unhandled Success Code');
      })
      .catch(err => {
        if (err.response.status === 302) {
          const code = this.findRegexMatch(/code=(.*)&/gm, err.response.headers.location);
          const grantId = this.findRegexMatch(/&grant_id=(.*)/gm, err.response.headers.location);

          if (code && grantId) return {code, grantId};
          throw new Error('Fetch Authorization Code: Missing Code or Grant ID');
        }
        throw new Error('Fetch Authorization Code: Unhandled Error Code');
      });
  }

  private findRegexMatch(regex: RegExp, html: string): string | undefined {
    const match = regex.exec(html);
    if (match) {
      return match[1];
    }
    return undefined;
  }

  /**
   * Get a new access token from a refresh token
   * @param refreshToken
   * @returns accessToken
   */
  public async getAccessTokenFromRefreshToken(refreshToken: string): Promise<AccessToken> {
    return await axios
      .post(
        'https://api.mps.ford.com/api/token/v2/cat-with-refresh-token',
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            ...this.getDefaultHeaders(),
            'Content-Type': 'application/json',
            'Application-Id': this.region,
          },
        }
      )
      .then(res => {
        return new AccessToken(res.data.access_token, res.data.expires_in, res.data.refresh_token);
      })
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
  }

  /**
   * Handles requesting an access token from the API
   * @param data {}
   * @returns accessToken
   */
  private async requestAccessToken(data: {}): Promise<AccessToken> {
    const accessToken: AccessToken = await axios
      .post(
        `https://sso.ci.ford.com/oidc/endpoint/default/token`,
        new URLSearchParams(data).toString(),
        {
          headers: {
            ...this.getDefaultHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then(async res => {
        if (res.status === 200 && res.data.access_token) {
          return await axios
            .post(
              'https://api.mps.ford.com/api/token/v2/cat-with-ci-access-token',
              {
                ciToken: res.data.access_token,
              },
              {
                headers: {
                  ...this.getDefaultHeaders(),
                  'Content-Type': 'application/json',
                  'Application-Id': this.region,
                },
              }
            )
            .then(res => {
              return new AccessToken(
                res.data.access_token,
                res.data.expires_in,
                res.data.refresh_token
              );
            })
            .catch(err => {
              throw err;
            });
        } else throw new ConnectedCarException(500, 'Access Token was not returned');
      })
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
    return accessToken;
  }

  private async getDefaultHeaders(): Promise<{}> {
    return {
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'FordPass/24 CFNetwork/1399 Darwin/22.1.0',
      'Accept-Encoding': 'gzip, deflate, br',
    };
  }
}
