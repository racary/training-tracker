import schedule from 'node-schedule';
import * as w from './whispers/missing-training-whisper';
import * as search from './aptitudes/ui/searchListener';

schedule.scheduleJob('0 10 * * *', () => {
  w.trainingWhisper();
});
search.start();
