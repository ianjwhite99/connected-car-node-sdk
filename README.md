#

![ConnectedCar Node SDK Logo](https://user-images.githubusercontent.com/35158392/147300580-29723aab-ffae-46d3-ae60-72af59065daa.png)

The ConnectedCar JavaScript SDK is an open-source, python package that provides the ability to send
commands to your Ford Sync Connect (Ford Pass) connected vehicle.

## Installation

```sh
npm install connected-car
```

Requirements

- To make requests to a vehicle, the end user must have signed up for an account using
  [Ford Pass](https://owner.ford.com/fordpass/fordpass-sync-connect.html). These credentials will be
  used to authenticate your requests.

## Getting Started

Import the ConnectedCar SDK

```javascript
import connectedcar from 'connected-car';
```

Create a new connectedcar `client`

- Note the default ConnectedCar client_id is `9fb503e0-715b-47e8-adfd-ad4b7770f73b`

```javascript
const client = connectedcar.AuthClient('9fb503e0-715b-47e8-adfd-ad4b7770f73b', {region: 'US'}); // Region argument is only required if you live outside the United States.
```

- Note: If your region is outside of the US you can pass different region parameters to the User
  class. Regions: (US, CA, EU, AU)

Use `client.getAccessTokenFromCredentials()` to exchange your user credentials for an **token
object**. To make any vehicle data request to the Ford Sync Connect API, you'll need to give the SDK
a valid **access token**.

```javascript
const token = await client.getAccessTokenFromCredentials({
  username: '<username>',
  password: '<password>',
});
```

Access tokens will expire every 2 hours, so you'll need to constantly refresh them by calling
`client.getAccessTokenFromRefreshToken()`

```javascript
const refreshToken = await client.getAccessTokenFromRefreshToken(token.getRefreshToken());
```

With your access token in hand, use `connectedcar.User()` to get a User object representing the
user.

```javascript
const user = connectedcar.User(token.getValue());
```

Use `user.vehicles()` to return an array of all the vehicles associated with a users account. The
response will include the **vehicle vin**.

```javascript
const vehicles = await user.vehicles();

const vehicleList = []; // Array of vehicles

for (userVehicle of vehicles) // For each user vehicle
  vehicleList.push(userVehicle['VIN']);
```

Now with a **vehicle vin** in hand, use `connectedcar.Vehicle()` to get a Vehicle object
representing the user's vehicle.

```javascript
let currentVehicle = connectedcar.Vehicle(vehicleList[0], token.getValue());
```

Now you can ask the car to do things, or ask it for some data! For example:

```javascript
await currentVehicle.start();
```

## Examples & Documentation

For more examples on what you can do with your ConnectedCar, see the [examples](/examples) folder or
take a peek at the [documentation](https://ianjwhite99.github.io/connected-car-node-sdk/).

## Funding & Support

If you are interested in supporting the development of my projects check out my
[patreon](https://www.patreon.com/ianjwhite99) or
[buy me a coffee](https://www.buymeacoffee.com/ianjwhite9).

## Disclaimer

THIS CODEBASE IS NOT ENDORSED, AFFILIATED, OR ASSOCIATED WITH FORD, FOMOCO OR THE FORD MOTOR
COMPANY.
