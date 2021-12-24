import axios from 'axios';
import {URLSearchParams} from 'url';
import {ConnectedCarException} from '../Exceptions/ConnectedCarException';
import {AccessToken} from './AccessToken';

export interface OAuthRequestInterface {
  client_id: string;
  grant_type: string;
  username?: string;
  password?: string;
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

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  /**
   * Get a new access token from credentials
   * @param auth AuthInterface
   * @returns accessToken
   */
  public async getAccessTokenFromCredentials(auth: AuthInterface): Promise<AccessToken | void> {
    const data: OAuthRequestInterface = {
      client_id: this.clientId,
      grant_type: 'password',
      username: auth.username,
      password: auth.password,
    };
    return await this.requestAccessToken(data);
  }

  /**
   * Get a new access token from a refresh token
   * @param refreshToken
   * @returns accessToken
   */
  public async getAccessTokenFromRefreshToken(refreshToken: string): Promise<AccessToken | void> {
    const data: OAuthRequestInterface = {
      client_id: this.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return await this.requestAccessToken(data);
  }

  /**
   * Handles requesting an access token from the API
   * @param data {}
   * @returns accessToken
   */
  private async requestAccessToken(data: {}): Promise<AccessToken | void> {
    const accessToken = await axios
      .post(
        `https://sso.ci.ford.com/oidc/endpoint/default/token`,
        new URLSearchParams(data).toString(),
        {
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'fordpass-na/353 CFNetwork/1121.2.2 Darwin/19.3.0',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        }
      )
      .then(res => {
        if (res.status === 200 && res.data.access_token) {
          return new AccessToken(
            res.data.access_token,
            res.data.expires_in,
            res.data.refresh_token
          );
        }
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
}
