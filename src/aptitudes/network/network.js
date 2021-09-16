import { network } from '@oliveai/ldk';

const getNamelyUsers = async () => {
  const res = await network.httpRequest({
    method: 'GET',
    url: 'localhost:3000/api/users/namely',
    headers: {
      Accept: 'application/json',
    },
  });

  const decoded = await network.decode(res.body);
  return JSON.parse(decoded);
};

export default { getNamelyUsers };
