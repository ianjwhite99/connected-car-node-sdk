import SyncConnect from '../src';

const main = async (): Promise<void> => {
  // Establish SyncConnect AuthClient
  const client = SyncConnect.AuthClient('9fb503e0-715b-47e8-adfd-ad4b7770f73b');

  const username = '<username>';
  const password = '<password>';
  const vin = '<vin>';

  // Retrieve access token from credentials
  const token = await client.getAccessTokenFromCredentials({
    username,
    password,
  });

  if (token) {
    const user = SyncConnect.User(token.getValue()); // Create SyncConnect User
    await user.addVehicle(vin); // Add vehicle to user account
    console.log(`Successfully added vehicle to user account`);

    const vehicle = SyncConnect.Vehicle(vin, token.getValue()); // Create SyncConnect Vehicle
    await vehicle.sendAuthorization(); // Send authorization request to vehicle
    console.log(`Successfully sent authorization request to vehicle`);

    /**
     * CONFIRM REQUEST ON VEHICLE HEAD UNIT
     * ...checking for confirmation every 5 seconds or until 25 attempts are made
     */
    let success = false;
    let attempts = 0;
    do {
      attempts += 1;
      console.log('Waiting for authorization confirmation...');
      const authStatus = await vehicle.authorizationStatus();
      if (authStatus.vehicleAuthorizationStatus.authorization === 'AUTHORIZED') success = true;
      await new Promise(resolve => setTimeout(resolve, 5000));
    } while (!success || attempts >= 25);

    console.log('Authorization confirmed!');
  }
};

main();
