import axios, {AxiosResponse} from 'axios';
import {SyncException} from '../Exceptions/SyncException';

/**
 * @class Api
 */
export class Api {
  private headers: {};

  constructor(accessToken: string) {
    this.headers = {
      'auth-token': accessToken,
      Accept: '*/*',
      'Accept-Language': 'en-US',
      'User-Agent': 'fordpass-na/353 CFNetwork/1121.2.2 Darwin/19.3.0',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Application-Id': '71A3AD0A-CF46-4CCF-B473-FC7FE5BC4592',
    };
  }

  public async get(url: string): Promise<AxiosResponse['data']> {
    return await axios
      .get(url, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new SyncException(status, message);
      });
  }

  public async post(url: string, data: {}): Promise<AxiosResponse['data']> {
    return await axios
      .post(url, data, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new SyncException(status, message);
      });
  }

  public async put(url: string, data?: {}): Promise<AxiosResponse['data']> {
    return await axios
      .put(url, data, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new SyncException(status, message);
      });
  }

  public async delete(url: string): Promise<AxiosResponse['data']> {
    return await axios
      .delete(url, {headers: this.headers})
      .then(res => res.data)
      .catch(err => {
        let status = err.response.status;
        let message = err.message;
        if (err.response.data.status) status = err.response.data.status;
        if (err.response.data.message) message = err.response.data.message;
        throw new SyncException(status, message);
      });
  }
}
