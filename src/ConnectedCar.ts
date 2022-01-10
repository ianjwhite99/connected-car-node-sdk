import {OAuth2Client} from './Authentication/OAuth2Client';
import {Vehicle} from './Vehicle/Vehicle';
import {User} from './User/User';

export interface RegionInterface {
  region: 'US' | 'CA' | 'EU' | 'AU';
}

/**
 * @class ConnectedCar
 */
export class ConnectedCar {
  private static region = 'US';

  /**
   * Creates a new OAuth2Client object with the given client id.
   * @param clientId
   * @returns OAuth2Client
   */
  public static AuthClient(clientId: string, region?: RegionInterface): OAuth2Client {
    if (region) this.region = region.region;
    return new OAuth2Client(clientId, this.region);
  }

  /**
   * Creates a vehicle user object with the given vin and access token.
   * @param vin
   * @param accessToken
   * @returns Vehicle
   */
  public static Vehicle(vehicleVIN: string, accessToken: string, passedRegion?: string): Vehicle {
    let region = this.region;
    if (passedRegion) region = passedRegion;
    return new Vehicle(vehicleVIN, accessToken, region);
  }

  /**
   * Creates a new user object with the given access token.
   * @param accessToken
   * @returns User
   */
  public static User(accessToken: string, passedRegion?: string): User {
    let region = this.region;
    if (passedRegion) region = passedRegion;
    return new User(accessToken, region);
  }
}
