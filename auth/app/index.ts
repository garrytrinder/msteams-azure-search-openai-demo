import {Application, DefaultTurnState} from '@microsoft/teams-ai';
import {BlobsStorage} from 'botbuilder-azure-blobs';
import adapter from './shared/adapter';
import * as bot from './bot';
import config from './shared/config';

interface ConversationState {
  history: ChatHistory[];
}

export interface ChatHistory {
  bot?: string;
  user: string;
}

export type ApplicationTurnState = DefaultTurnState<ConversationState>;

// Create storage
const storage = new BlobsStorage(
  config.blobConnectionString,
  config.blobContainerName
);

// Create application
const app = new Application<ApplicationTurnState>({
  adapter,
  storage,
  authentication: {
    connectionName: config.oauthConnectionName,
    title: 'Sign in to use the bot',
  },
});

// Setup bot
bot.setup(app);

export default app;
