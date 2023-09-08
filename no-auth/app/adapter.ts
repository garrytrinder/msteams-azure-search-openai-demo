import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationServiceClientCredentialFactory,
  TurnContext,
} from 'botbuilder';
import config from './config';

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
  {},
  new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: 'MultiTenant',
  })
);

const adapter = new CloudAdapter(botFrameworkAuthentication);

adapter.onTurnError = async (context: TurnContext, error: Error) => {
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  await context.sendActivity(
    `The bot encountered unhandled error:\n ${error.message}`
  );
};

export default adapter;
