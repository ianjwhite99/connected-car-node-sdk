import ConnectedCar from '../src';

const main = async (): Promise<void> => {
  const client = ConnectedCar.AuthClient('9fb503e0-715b-47e8-adfd-ad4b7770f73b');

  const username = '<username>';
  const password = '<password>';
  const vin = '<vin>';

  const token = await client.getAccessTokenFromCredentials({
    username,
    password,
  });

  if (token) {
    const vehicle = ConnectedCar.Vehicle(vin, token.getValue());
    console.log(await vehicle.start());
  }
};

main();
