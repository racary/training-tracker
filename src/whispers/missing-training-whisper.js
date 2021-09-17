import { user, whisper } from '@oliveai/ldk';
import { Buffer } from 'buffer';
import network from '../aptitudes/network/network';

const { Box, Markdown } = whisper.WhisperComponentType;
const { Left } = whisper.JustifyContent;
const { Vertical } = whisper.Direction;

const findIncompleteTrainingsByEmail = async (email) => {
  const trainings = await network.getTrainingsByEmail(email);
  const incompleteTrainigs = trainings
    .filter((r) => !r.completion_date)
    .map((training) => training.campaign_name);
  return incompleteTrainigs;
};

const findDirectReportsMissingTraining = async (reports) => {
  return Promise.all(
    reports.map(async (report) => {
      return {
        name: `${report.firstName} ${report.lastName}`,
        missingTraining: await findIncompleteTrainingsByEmail(report.email),
      };
    })
  );
};

const createIncompleteTrainingsComponent = async (myEmail) => {
  let component = [];
  if (myEmail) {
    const incompleteTrainings = await findIncompleteTrainingsByEmail(myEmail);
    console.log(
      `${myEmail} has following incomplete trainings ==> ${JSON.stringify(incompleteTrainings)}`
    );
    component = incompleteTrainings.map((r) => ({
      body: r,
      type: Markdown,
    }));

    if (!component.length) {
      component.push({
        body: 'No missing trainings!!',
        type: whisper.WhisperComponentType.Markdown,
      });
    }
  }
  return component;
};

const decodeJWTToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    console.log(`json payload ==> ${JSON.stringify(jsonPayload)}`);
    return jsonPayload;
  } catch (err) {
    console.error('Failed to decode token', err);
    throw err;
  }
};

const createDirectReportsWhisper = async (directReports) => {
  if (directReports.length) {
    console.log('direct reports exist');
    const missingTraining = await findDirectReportsMissingTraining(directReports);

    if (missingTraining.length) {
      console.log('direct reports are missing trainings');

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

const trainingWhisper = async (email, userName) => {
  const label = userName ? `${userName}'s Missing Trainings` : 'My Missing Trainings';
  console.log(`creating whisper for ${email}`);
  await whisper.create({
    label,
    onClose: () => console.log('Closed Training Whisper'),
    components: await createIncompleteTrainingsComponent(email),
  });
};

const noUserFoundWhisper = async (u) => {
  await whisper.create({
    label: 'No User Found',
    onClose: () => console.log('Closed Training Whisper'),
    components: [{ type: Markdown, body: `No user found with name ${u}` }],
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
  console.log(
    `current user email ${email} has following direct reports ${JSON.stringify(directReports)}`
  );
  await trainingWhisper(email);
  await createDirectReportsWhisper(directReports);
};

export default { noUserFoundWhisper, trainingWhisper, userAndDirectReportsTrainingWhisper };
