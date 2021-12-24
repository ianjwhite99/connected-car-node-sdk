import {OAuth2Client} from './Authentication/OAuth2Client';
import {Vehicle} from './Vehicle/Vehicle';
import {User} from './User/User';

/**
 * @class ConnectedCar
 */
export class ConnectedCar {
  /**
   * Creates a new OAuth2Client object with the given client id.
   * @param clientId
   * @returns OAuth2Client
   */
  public static AuthClient(clientId: string): OAuth2Client {
    return new OAuth2Client(clientId);
  }

  /**
   * Creates a vehicle user object with the given vin and access token.
   * @param vin
   * @param accessToken
   * @returns Vehicle
   */
  public static Vehicle(vehicleVIN: string, accessToken: string): Vehicle {
    return new Vehicle(vehicleVIN, accessToken);
  }

  /**
   * Creates a new user object with the given access token.
   * @param accessToken
   * @returns User
   */
  public static User(accessToken: string): User {
    return new User(accessToken);
  }
}
