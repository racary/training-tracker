import { ui } from '@oliveai/ldk';
import w from '../../whispers/missing-training-whisper';
import network from '../network/network';

const getEmailByUser = async (userName) => {
  const user = await network.getNamelyUser(userName);
  console.log(`found user ${JSON.stringify(user)} for user name ${userName}`);
  if (user) {
    return user;
  }

  console.log(`no user found with userName ${userName}`);
  return '';
};

const buildName = (user) => `${user.firstName} ${user.lastName}`;

export const start = async () => {
  ui.listenGlobalSearch(async (value) => {
    console.info(`search bar value ${value}`);

    const user = await getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(user.email, buildName(user));
  });

  await ui.listenSearchbar(async (value) => {
    console.info(`search bar value ${value}`);

    const user = await getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(user.email, buildName(user));
  });
};
