import { user, whisper } from '@oliveai/ldk';
import { Buffer } from 'buffer';

const res = [
  {
    enrollment_id: 1425526,
    content_type: 'Uploaded Policy',
    module_name: 'Acceptable Use Policy',
    user: {
      id: 796742,
      first_name: 'Sarah',
      last_name: 'Thomas',
      email: 's_thomas@kb4-demo.com',
    },
    campaign_name: 'New Employee Policies',
    enrollment_date: '2019-04-02T15:02:38.000Z',
    start_date: '2019-04-02T15:02:38.000Z',
    completion_date: '',
    status: 'Passed',
    time_spent: 2340,
    policy_acknowledged: false,
  },
  {
    enrollment_id: 1425526,
    content_type: 'Uploaded Policy',
    module_name: 'Acceptable Use Policy',
    user: {
      id: 796742,
      first_name: 'Sarah',
      last_name: 'Thomas',
      email: 's_thomas@kb4-demo.com',
    },
    campaign_name: 'New Employee Policies',
    enrollment_date: '2019-04-02T15:02:38.000Z',
    start_date: '2019-04-02T15:02:38.000Z',
    completion_date: '2019-04-02T15:02:38.000Z',
    status: 'Passed',
    time_spent: 2340,
    policy_acknowledged: false,
  },
  {
    enrollment_id: 1425526,
    content_type: 'Uploaded Policy',
    module_name: 'Acceptable Use Policy',
    user: {
      id: 796742,
      first_name: 'Sarah',
      last_name: 'Thomas',
      email: 's_thomas@kb4-demo.com',
    },
    campaign_name: 'New Employee Policies',
    enrollment_date: '2019-04-02T15:02:38.000Z',
    start_date: '2019-04-02T15:02:38.000Z',
    completion_date: '2019-04-02T15:02:38.000Z',
    status: 'Passed',
    time_spent: 2340,
    policy_acknowledged: false,
  },
];

const createComponent = (email) => {
  const trainingsByEmail = res
    .filter((r) => r.user.email === email && !r.completion_date)
    .map((r) => ({ body: r.campaign_name, type: whisper.WhisperComponentType.Markdown }));

  if (!trainingsByEmail.length) {
    trainingsByEmail.push({
      body: 'No missing trainings!!',
      type: whisper.WhisperComponentType.Markdown,
    });
  }
  return trainingsByEmail;
};

const decodeJWTToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    console.log(`json payload ==> ${jsonPayload}`);
    return jsonPayload;
  } catch (err) {
    console.error('Failed to decode token', err);
    throw err;
  }
};

export const trainingWhisper = async (email) => {
  let userEmail = email;
  if (!userEmail) {
    const jwtUser = decodeJWTToken(await user.jwt());
    ({ email: userEmail } = jwtUser);
  }
  console.log(`current user email ==> ${userEmail}`);
  await whisper.create({
    label: 'Missing Trainings',
    onClose: () => console.log('Closed Training Whisper'),
    components: createComponent(userEmail),
  });
};
