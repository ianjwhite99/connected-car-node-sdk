import {Api} from '../Api/Api';
import {AxiosResponse} from 'axios';

/**
 * @class User
 * @extends Api
 */
export class User extends Api {
  constructor(accessToken: string, region = 'US') {
    super(accessToken, region);
  }

  /**
   * Get current user information
   * @returns
   */
  public async info(): Promise<AxiosResponse['data']> {
    return this.get(`https://usapi.cv.ford.com/api/users`);
  }

  /**
   * Get list of user account vehicles
   * @returns
   */
  public async vehicles(): Promise<AxiosResponse['data']> {
    const vehicleData = await this.get(
      `https://api.mps.ford.com/api/users/vehicles`
    );
    return vehicleData['vehicles']['$values'];
  }

  /**
   * Add a vehicle to a user account
   * @param vin
   * @returns
   */
  public async addVehicle(vin: string): Promise<AxiosResponse['data']> {
    const data = {
      countryCode: 'USA',
      nickName: '',
      vin: vin,
      appBrand: 'F',
      appRegion: 'NA',
    };
    return this.post(`https://api.mps.ford.com/api/garage/mobile`, data);
  }

  /**
   * Delete a vehicle from a user account
   * @param vin
   * @returns
   */
  public async deleteVehicle(vin: string): Promise<AxiosResponse['data']> {
    return this.delete(`https://usapi.cv.ford.com/api/users/vehicles/${vin}`);
  }

  /**
   * Get messages from a user account
   * @returns
   */
  public async getMessages(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://api.mps.ford.com/api/messagecenter/v3/messages?lrdt=1970-01-01T00:00:00Z`
    );
  }

  /**
   * Request vehicle access based on VIN
   * @param vin
   * @returns
   */
  public async requestVehicleAccess(vin: string): Promise<AxiosResponse['data']> {
    return this.post(`https://usapi.cv.ford.com/api/vehicles/${vin}/drivers/accessrequest`, {});
  }

  /**
   * Approve a vehicle access request
   * @param messageId
   * @returns
   */
  public async authorizeVehicle(messageId: string): Promise<AxiosResponse['data']> {
    return this.put(
      `https://api.mps.ford.com/api/authorization/retail/v1/${messageId}/approveAccess`
    );
  }
}
