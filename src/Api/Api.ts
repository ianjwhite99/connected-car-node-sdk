import axios, {AxiosResponse} from 'axios';
import {ConnectedCarException} from '../Exceptions/ConnectedCarException';

/**
 * @class Api
 */
export class Api {
  private headers: {};

  constructor(accessToken: string, region: string, locale = 'en-US') {
    const regions = {
      US: '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
      CA: '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
      EU: '1E8C7794-FF5F-49BC-9596-A1E0C86C5B19',
      AU: '5C80A6BB-CF0D-4A30-BDBF-FC804B5C1A98',
    };

    const countryCode = {
      US: 'USA',
      CA: 'CAN',
      EU: 'EUR',
      AU: 'AUS',
    };

    this.headers = {
      'auth-token': accessToken,
      Accept: '*/*',
      'Accept-Language': 'en-US',
      'User-Agent': 'FordPass/24 CFNetwork/1399 Darwin/22.1.0',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Application-Id': regions[region],
      locale,
      countryCode: countryCode[region],
    };
  }

  protected async get(url: string): Promise<AxiosResponse['data']> {
    return await axios
      .get(url, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
  }

  protected async post(url: string, data: {}): Promise<AxiosResponse['data']> {
    return await axios
      .post(url, data, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
  }

  protected async put(url: string, data?: {}): Promise<AxiosResponse['data']> {
    return await axios
      .put(url, data, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
  }

  protected async delete(url: string): Promise<AxiosResponse['data']> {
    return await axios
      .delete(url, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new ConnectedCarException(status, message);
      });
  }
}
