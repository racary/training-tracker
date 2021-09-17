import { network } from '@oliveai/ldk';

const baseUrl = 'http://127.0.0.1:3001/api';

const getNamelyUsers = async () => {
  try {
    const res = await network.httpRequest({
      headers: {
        Accept: ['application/json'],
      },
      method: 'GET',
      url: `${baseUrl}/users/namely`,
    });

    const decoded = await network.decode(res.body);
    console.log(`namely users ==> ${decoded}`);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('failed to get namely users ', err);
    throw err;
  }
};

const getNamelyUser = async (name) => {
  try {
    const res = await network.httpRequest({
      headers: {
        Accept: ['application/json'],
      },
      method: 'GET',
      url: `${baseUrl}/users/${name}/namely`,
    });

    const decoded = await network.decode(res.body);
    console.log(`namely users ==> ${decoded}`);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('failed to get namely users ', err);
    throw err;
  }
};

const getTrainingsByEmail = async (email) => {
  try {
    const res = await network.httpRequest({
      headers: {
        Accept: ['application/json'],
      },
      method: 'GET',
      url: `${baseUrl}/trainings/${email}`,
    });

    const decoded = await network.decode(res.body);
    console.log(`trainings for ${email} ==> ${decoded}`);
    return JSON.parse(decoded);
  } catch (err) {
    console.error(`failed to get trainings for ${email}`, err);
    throw err;
  }
};

export default { getNamelyUser, getNamelyUsers, getTrainingsByEmail };
