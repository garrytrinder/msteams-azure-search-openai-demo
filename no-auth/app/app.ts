import {Application} from '@microsoft/teams-ai';
import {BlobsStorage} from 'botbuilder-azure-blobs';
import adapter from './adapter';
import * as bot from './bot';
import config from './config';
import {ApplicationTurnState} from './types';

const storage = new BlobsStorage(
  config.blobConnectionString,
  config.blobContainerName
);

const app = new Application<ApplicationTurnState>({
  adapter,
  storage,
});

bot.setup(app);

export default app;
