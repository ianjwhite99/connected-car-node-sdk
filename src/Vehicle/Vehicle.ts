import {AxiosResponse} from 'axios';
import {Api} from '../Api/Api';
import {ConnectedCarException} from '../Exceptions/ConnectedCarException';

/**
 * @class Vehicle
 * @extends Api
 */
export class Vehicle extends Api {
  private vehicleVIN: string;

  constructor(vehicleVIN: string, accessToken: string, region: string) {
    super(accessToken, region);
    this.vehicleVIN = vehicleVIN;
  }

  /**
   * Get vehicle status
   * @returns vehicle status
   */
  public async status(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://usapi.cv.ford.com/api/vehicles/v4/${this.vehicleVIN}/status?lrdt=01-01-1970%2000:00:00`
    );
  }

  /**
   * Request vehicle status refresh
   * @returns refresh status
   */
  public async requestStatusRefresh(): Promise<AxiosResponse['data']> {
    return this.put(`https://usapi.cv.ford.com/api/vehicles/v2/${this.vehicleVIN}/status`, {});
  }

  /**
   * Send authoriztion request to vehicle
   * @returns status of authorization request
   */
  public async sendAuthorization(): Promise<AxiosResponse['data']> {
    return this.post(`https://usapi.cv.ford.com/api/vehicles/v2/${this.vehicleVIN}/drivers`, {});
  }

  /**
   * Get authorization status
   * @returns authroization status
   */
  public async authorizationStatus(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://usapi.cv.ford.com/api/vehicles/${this.vehicleVIN}/authstatus?lrdt=01-01-1970%2000:00:00`
    );
  }

  /**
   * Get vehicle details
   * @returns vehicle details
   */
  public async details(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://usapi.cv.ford.com/api/users/vehicles/${this.vehicleVIN}/detail?lrdt=01-01-1970%2000:00:00`
    );
  }

  /**
   * Get vehicle maintenance schedule
   * @returns vehicle capabilities
   */
  public async maintenanceSchedule(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://api.mps.ford.com/api/vehiclemaintenance/v1/maintenance-schedule?vin=${this.vehicleVIN}&language=EN&country=USA`
    );
  }

  /**
   * Get vehicle capabilities
   * @returns vehicle capabilities
   */
  public async capabilities(): Promise<AxiosResponse['data']> {
    return this.get(`https://api.mps.ford.com/api/capability/v1/vehicles/${this.vehicleVIN}`);
  }

  /**
   * Get vehicle vin
   * @returns vin
   */
  public async vin(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['vin'];
  }

  /**
   * Get vehicle odometer
   * @returns odometer
   */
  public async odometer(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['odometer'];
  }

  /**
   * Get vehicle fuel level
   * @returns fuel
   */
  public async fuel(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['fuel'];
  }

  /**
   * Get vehicle oil life
   * @returns oil
   */
  public async oil(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['oil'];
  }

  /**
   * Get vehicle tire pressure
   * @returns tire pressure
   */
  public async tirePressure(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['TPMS'];
  }

  /**
   * Get vehicle location
   * @returns location
   */
  public async location(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['gps'];
  }

  /**
   * Get vehicle window position
   * @returns window position
   */
  public async windowPosition(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['windowPosition'];
  }

  /**
   * Get vehicle door status
   * @returns door status
   */
  public async doorStatus(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['doorStatus'];
  }

  /**
   * Get vehicle lock status
   * @returns lock status
   */
  public async lockStatus(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['lockStatus'];
  }

  /**
   * Get vehicle alarm status
   * @returns alarm status
   */
  public async alarmStatus(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['alarmStatus'];
  }

  /**
   * Get vehicle ignition status
   * @returns ignition status
   */
  public async ignitionStatus(): Promise<AxiosResponse['data']> {
    const json = await this.status();
    return json['vehiclestatus']['ignitionStatus'];
  }

  /**
   * Send vehicle wakeup command
   * @returns wakeup status
   */
  public async wakeup(): Promise<AxiosResponse['data']> {
    return this.get(
      `https://api.mps.ford.com/api/dashboard/v1/users/vehicles?language=EN&wakeupVin=${this.vehicleVIN}&skipRecall=true&country=USA&region=US`
    );
  }

  /**
   * Send vehicle start command
   * @returns vehicle start status
   */
  public async start(): Promise<AxiosResponse['data']> {
    return this.vehicleActionHandler('engine/start', 'PUT');
  }

  /**
   * Send vehicle stop command
   * @returns vehicle stop status
   */
  public async stop(): Promise<AxiosResponse['data']> {
    return this.vehicleActionHandler('engine/start', 'DELETE');
  }

  /**
   * Send vehicle lock command
   * @returns vehicle lock status
   */
  public async lock(): Promise<AxiosResponse['data']> {
    return this.vehicleActionHandler('doors/lock', 'PUT');
  }

  /**
   * Send vehicle unlock command
   * @returns vehicle unlock status
   */
  public async unlock(): Promise<AxiosResponse['data']> {
    return this.vehicleActionHandler('doors/lock', 'DELETE');
  }

  /**
   * Handles vehicle action requests
   * @param contenxt endpoint to send request to
   * @param method method to use
   * @returns vehicle action responses
   */
  private async vehicleActionHandler(
    context: string,
    method: string
  ): Promise<AxiosResponse['data']> {
    if (method === 'PUT') {
      return await this.put(
        `https://usapi.cv.ford.com/api/vehicles/v2/${this.vehicleVIN}/${context}`
      )
        .then(async res => {
          if (res.commandId) return await this.checkVehicleStatus(context, res.commandId);
          throw new ConnectedCarException(404, 'Vehicle commandId not found');
        })
        .catch(err => {
          throw err;
        });
    } else if (method === 'DELETE') {
      return await this.delete(
        `https://usapi.cv.ford.com/api/vehicles/v2/${this.vehicleVIN}/${context}`
      )
        .then(async res => {
          if (res.commandId) return await this.checkVehicleStatus(context, res.commandId);
          throw new ConnectedCarException(404, 'Vehicle commandId not found');
        })
        .catch(err => {
          throw err;
        });
    }
  }

  /**
   * Check the current vehicle action status
   * @param context
   * @param commandId
   * @returns vehicle action status
   */
  public async checkVehicleStatus(
    context: string,
    commandId: string
  ): Promise<AxiosResponse['data']> {
    let success = false;
    let attempts = 0;
    let response;
    do {
      response = await this.get(
        `https://usapi.cv.ford.com/api/vehicles/${this.vehicleVIN}/${context}/${commandId}`
      )
        .then(async (res: AxiosResponse['data']) => {
          if (res.status === 200) {
            success = true;
            return res;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts += 1;
          if (attempts >= 30) {
            throw new ConnectedCarException(408, 'Vehicle action timed out');
          }
        })
        .catch((err: ConnectedCarException) => {
          if (err.SyncErrorStatus === 502) {
            // If the status is 502, the action is still in progress
          } else throw err;
        });
    } while (!success);
    return response;
  }
}
