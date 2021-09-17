// import schedule from 'node-schedule';
import mtw from './whispers/missing-training-whisper';
import * as search from './aptitudes/ui/searchListener';

// schedule.scheduleJob('0 10 * * *', () => {
mtw.userAndDirectReportsTrainingWhisper();
// });
search.start();
