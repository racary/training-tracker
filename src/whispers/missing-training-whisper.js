import { user, whisper } from '@oliveai/ldk';
import { Buffer } from 'buffer';
import network from '../aptitudes/network/network';

const { Box, Markdown } = whisper.WhisperComponentType;
const { Left } = whisper.JustifyContent;
const { Vertical } = whisper.Direction;

const res = [
  {
    enrollment_id: 1425526,
    content_type: 'Uploaded Policy',
    module_name: 'Acceptable Use Policy',
    user: {
      id: 796742,
      first_name: 'Sarah',
      last_name: 'Thomas',
      email: 'test@test.com',
    },
    campaign_name: 'OWASP 10',
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
      email: 'test@test.com',
    },
    campaign_name: 'Compliance Training',
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

const findIncompleteTrainingsByEmail = (email) => {
  const incompleteTrainigs = res
    .filter((r) => r.user.email === email && !r.completion_date)
    .map((training) => training.campaign_name);
  return incompleteTrainigs;
};

const findDirectReportsMissingTraining = (reports) => {
  return reports.map((report) => {
    return {
      name: `${report.firstName} ${report.lastName}`,
      missingTraining: findIncompleteTrainingsByEmail(report.email),
    };
  });
};

const createIncompleteTrainingsComponent = (myEmail) => {
  const myMissingTrainings = findIncompleteTrainingsByEmail(myEmail).map((r) => ({
    body: r,
    type: Markdown,
  }));

  if (!myMissingTrainings.length) {
    myMissingTrainings.push({
      body: 'No missing trainings for me!!',
      type: whisper.WhisperComponentType.Markdown,
    });
  }
  return myMissingTrainings;
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

const createDirectReportsWhisper = async (directReports) => {
  if (directReports) {
    const missingTraining = findDirectReportsMissingTraining(directReports);

    if (missingTraining.length) {
      const components = missingTraining.map((mt) => {
        return {
          type: Box,
          justifyContent: Left,
          direction: Vertical,
          children: [
            {
              type: Markdown,
              body: `${mt.name} is missing following trainings: ${mt.missingTraining.join(', ')}`,
            },
          ], // drMissingTraining.missingTraining.map((mt) => ({ type: ListPair, label: drMissingTraining.name, value: mt, copyable: true, style: whisper.Urgency.None }))
        };
      });

      await whisper.create({
        label: 'Direct Reports Incomplete Training',
        onClose: () => console.log('Closed Direct Reports Training Whisper'),
        components,
      });

      // missingTraining.forEach(async (mt) => {
      //   await whisper.create({
      //     label: `${mt.name} is Missing Following Trainings`,
      //     components: mt.missingTraining.map((t) => ({ type: Markdown, body: t }))
      //   });
      // });
    }
  }
};

const getDirectReports = async (email) => {
  const users = await network.getNamelyUsers();

  const directReports = users.filter((u) => u.reportsTo.email === email);
  return directReports;
};

const trainingWhisper = async (email) => {
  console.log(`current user email ==> ${email}`);

  await whisper.create({
    label: 'My Missing Trainings',
    onClose: () => console.log('Closed Training Whisper'),
    components: createIncompleteTrainingsComponent(email),
  });
};

const getEmailFromJWT = async () => {
  const jwtUser = decodeJWTToken(await user.jwt());
  const { email } = jwtUser;
  return email;
};

const userAndDirectReportsTrainingWhisper = async () => {
  const email = await getEmailFromJWT();
  const directReports = await getDirectReports(email);

  await trainingWhisper(email);
  await createDirectReportsWhisper(directReports);
};

export default { trainingWhisper, userAndDirectReportsTrainingWhisper };
