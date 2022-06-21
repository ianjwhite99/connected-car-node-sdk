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
  public async getAccessTokenFromRefreshToken(refreshToken: string): Promise<AccessToken> {
    return await axios
      .put(
        'https://api.mps.ford.com/api/token/v2/cat-with-refresh-token',
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/json',
            'User-Agent': 'FordPass/5 CFNetwork/1327.0.4 Darwin/21.2.0',
            'Accept-Encoding': 'gzip, deflate, br',
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
            Accept: '*/*',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'FordPass/5 CFNetwork/1333.0.4 Darwin/21.5.0',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        }
      )
      .then(async res => {
        if (res.status === 200 && res.data.access_token) {
          return await axios
            .put(
              'https://api.mps.ford.com/api/token/v2/cat-with-ci-access-token',
              {
                ciToken: res.data.access_token,
              },
              {
                headers: {
                  Accept: '*/*',
                  'Accept-Language': 'en-US',
                  'Content-Type': 'application/json',
                  'User-Agent': 'FordPass/5 CFNetwork/1333.0.4 Darwin/21.5.0',
                  'Accept-Encoding': 'gzip, deflate, br',
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
}
