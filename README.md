![Connected Car Node SDK Logo](https://user-images.githubusercontent.com/35158392/147300580-29723aab-ffae-46d3-ae60-72af59065daa.png)

The Connected Car JavaScript SDK is an open-source, python package that provides the ability to send commands to your Ford Sync Connect (Ford Pass) connected vehicle.

# Installation
```sh
npm install connected-car
```

Requirements
- To make requests to a vehicle, the end user must have signed up for an account using [Ford Pass](https://owner.ford.com/fordpass/fordpass-sync-connect.html). These credentials will be used to authenticate your requests.
# Getting Started

Import the Connected Car SDK
```javascript
import connectedcar from 'connected-car'
```


Create a new connectedcar `client`
- Note the default Connected Car client_id is 
`9fb503e0-715b-47e8-adfd-ad4b7770f73b`

```javascript
const client = connectedcar.AuthClient('9fb503e0-715b-47e8-adfd-ad4b7770f73b')
```

Use `client.getAccessTokenFromCredentials()` to exchange your user credentials for an **access token object**. To make any vehicle data request to the Ford Sync Connect API, you'll need to give the SDK a valid **access token**. 

```javascript
const accessToken = await client.getAccessTokenFromCredentials({username: '<username>', password: '<password>'})
```

Access tokens will expire every 2 hours, so you'll need to constantly refresh them by calling `client.getAccessTokenFromRefreshToken()`

```javascript
const refreshToken = await client.getAccessTokenFromRefreshToken(accessToken.getRefreshToken())
```

With your access token in hand, use `connectedcar.User()` to get a User object representing the user.
```javascript
const user = connectedcar.User(accessToken.getValue())
```

Use `user.vehicles()` to return an array of all the vehicles associated with a users account. The response will include the **vehicle vin**.
```javascript
const vehicles = await user.vehicles()

const vehicleList = [] // Array of vehicles

for (userVehicle of vehicles) // For each user vehicle
    vehicleList.push(userVehicle['vin'])
```

Now with a **vehicle vin** in hand, use `connectedcar.Vehicle()` to get a Vehicle object representing the user's vehicle.
```javascript
let currentVehicle = connectedcar.Vehicle(vehicleList[0], accessToken.getValue()) // First Vehicle in vehicleList
```

Now you can ask the car to do things, or ask it for some data! For example:
```javascript
await currentVehicle.start()
```

# Examples & Documentation
For more examples on what you can do with your Connected Car, see the [examples](/examples) folder or take a peek at the [documentation](https://ianjwhite99.github.io/sync-connect-node-sdk/).

# Funding & Support
If you are interested in supporting the development of my projects check out my [patreon](https://www.patreon.com/ianjwhite99) or [buy me a coffee](https://www.buymeacoffee.com/ianjwhite9). 

# Disclaimer
THIS CODEBASE IS NOT ENDORSED, AFFILIATED, OR ASSOCIATED WITH FORD, FOMOCO OR THE FORD MOTOR COMPANY.
