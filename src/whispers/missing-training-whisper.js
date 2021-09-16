import { user, whisper } from '@oliveai/ldk';
import { Buffer } from 'buffer';

const { Box, ListPair, Markdown } = whisper.WhisperComponentType;
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
  .map(training => training.campaign_name);
  return incompleteTrainigs;
}

const findDirectReportsMissingTraining = reports => {
  return reports.map(report => {
    return {
      name: `${report.firstName} ${report.lastName}`,
      missingTraining: findIncompleteTrainingsByEmail(report.email)
    }
  });
}

const createComponentMyIncompleteTrainings = (myEmail) => {
  const myMissingTrainings = findIncompleteTrainingsByEmail(myEmail).map((r) => ({ body: r, type: Markdown }))

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
    const directReportsMissingTraining = findDirectReportsMissingTraining(directReports);

    if (directReportsMissingTraining.length) {
      const components = directReportsMissingTraining.map((drMissingTraining) => {
        return {
          type: Box,
          justifyContent: Left,
          direction: Vertical,
          children: [{type: Markdown, body: `${drMissingTraining.name} is missing following trainings: ${drMissingTraining.missingTraining.join(', ')}`}] //drMissingTraining.missingTraining.map((mt) => ({ type: ListPair, label: drMissingTraining.name, value: mt, copyable: true, style: whisper.Urgency.None }))
        }
      });

      await whisper.create({
        label: 'Direct Reports Incomplete Training',
        onClose: () => console.log('Closed Direct Reports Training Whisper'),
        components
      });

      // directReportsMissingTraining.forEach(async (directReportMissingTraining) => {
      //   await whisper.create({
      //     label: `${directReportMissingTraining.name} is Missing Following Trainings`,
      //     components: directReportMissingTraining.missingTraining.map((mt) => ({ type: Markdown, body: mt }))
      //   });
      // });
    }
  }
}

export const trainingWhisper = async (email) => {
  let userEmail = email;
  if (!userEmail) {
    const jwtUser = decodeJWTToken(await user.jwt());
    ({ email: userEmail } = jwtUser);
  }
  console.log(`current user email ==> ${userEmail}`);
  await whisper.create({
    label: 'My Missing Trainings',
    onClose: () => console.log('Closed Training Whisper'),
    components: createComponentMyIncompleteTrainings(userEmail),
  });

  await createDirectReportsWhisper([{email: 'test@test.com', firstName: 'T', lastName: 'C'}])
};
