import { ui } from '@oliveai/ldk';
import * as w from '../../whispers/missing-training-whisper';

const users = [
  {
    user: 'Sarah Thomas',
    email: 's_thomas@kb4-demo.com',
  },
];

const getEmailByUser = (userName) => {
  const res = users.find(({ user }) => user.toLowerCase() === userName);
  console.info(`getEmailByUser res ${res}`);
  return res.email;
};

export const start = async () => {
  ui.listenGlobalSearch(async (value) => {
    console.info(`search bar value ${value}`);

    const email = getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(email);
  });

  await ui.listenSearchbar(async (value) => {
    console.info(`search bar value ${value}`);

    const email = getEmailByUser(value.toLowerCase());
    await w.trainingWhisper(email);
  });
};
