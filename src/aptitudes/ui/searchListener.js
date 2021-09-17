import { ui } from '@oliveai/ldk';
import w from '../../whispers/missing-training-whisper';
import network from '../network/network';

const getEmailByUser = async (userName) => {
  const user = await network.getNamelyUser(userName);
  console.log(`found user ${user} for user name ${userName}`);
  if (user) {
    console.info(`getEmailByUser res ${JSON.stringify(user)}`);
    return user.email;
  }

  console.log(`no user found with userName ${userName}`);
  return '';
};

export const start = async () => {
  ui.listenGlobalSearch(async (value) => {
    console.info(`search bar value ${value}`);

    const email = await getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(email);
  });

  await ui.listenSearchbar(async (value) => {
    console.info(`search bar value ${value}`);

    const email = getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(email);
  });
};
