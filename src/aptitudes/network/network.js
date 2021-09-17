import { network } from '@oliveai/ldk';

const getNamelyUsers = async () => {
  try {
    const res = await network.httpRequest({
      headers: {
        Accept: ['application/json'],
      },
      method: 'GET',
      url: 'http://127.0.0.1:3001/api/users/namely',
    });

    const decoded = await network.decode(res.body);
    console.log(`decoded payload ==> ${decoded}`);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('failed to get namely users ', err);
    throw err;
  }
};

export default { getNamelyUsers };
