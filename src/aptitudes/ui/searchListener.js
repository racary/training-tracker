import { ui } from '@oliveai/ldk';
import w from '../../whispers/missing-training-whisper';
import network from '../network/network';

const getEmailByUser = async (userName) => {
  const user = await network.getNamelyUser(userName);
  console.log(`found user ${JSON.stringify(user)} for user name ${userName}`);
  return user;
};

const buildName = (user) => `${user.firstName} ${user.lastName}`;

const createWhisper = async (user, value) => {
  if (Object.keys(user).length) {
    await w.trainingWhisper(user.email, buildName(user));
  } else {
    await w.noUserFoundWhisper(value);
  }
};

export const start = async () => {
  await ui.listenGlobalSearch(async (value) => {
    console.info(`search bar value ${value}`);

    const user = await getEmailByUser(value.toLowerCase());
    await createWhisper(user, value);
  });

  await ui.listenSearchbar(async (value) => {
    console.info(`search bar value ${value}`);

    const user = await getEmailByUser(value.toLowerCase());
    await createWhisper(user, value);
  });
};
