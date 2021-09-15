import { whisper } from '@oliveai/ldk';

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

  return trainingsByEmail;
};

export const trainingWhisper = async (email) => {
  await whisper.create({
    label: 'Missing Trainings',
    onClose: () => console.log('Closed Training Whisper'),
    components: createComponent(email),
  });
};
