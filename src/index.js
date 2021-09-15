// import schedule from 'node-schedule';
// import * as w from './whispers/missing-training-whisper';
import * as search from './aptitudes/ui/searchListener';

// schedule.scheduleJob('* 10 * * *', () => {
// w.trainingWhisper('s_thomas@kb4-demo.com');
// });
search.start();
