import { network } from '@oliveai/ldk';

const getNamelyUsers = async () => {
  try {
    const res = await network.httpRequest({
      method: 'GET',
      url: 'localhost:3000/api/users/namely',
      headers: {
        Accept: 'application/json',
      },
    });

    const decoded = await network.decode(res.body);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('failed to get namely users ', err);
    throw err;
  }
};

export default { getNamelyUsers };
