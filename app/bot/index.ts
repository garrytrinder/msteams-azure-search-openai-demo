import {ActivityTypes, TurnContext} from 'botbuilder';
import {Application} from '@microsoft/teams-ai';
import {ApplicationTurnState} from '..';
import {
  resetConversationHistory,
  getChatResponse,
  getCitations,
  getSupportingContent,
  isExampleMessage,
  renderCard,
  sendAdaptiveCard,
  replaceCitations,
  createConversationHistory,
  addMessageToConversationHistory,
  convertCitations,
} from '../shared/helpers';

import responseCard from '../shared/cards/response.json';
import welcomeCard from '../shared/cards/welcome.json';

import {ResponseCard, WelcomeCard} from '../shared/types';
import {constants} from '../shared/constants';

const setup = (app: Application) => {
  app.activity(
    ActivityTypes.InstallationUpdate,
    async (context: TurnContext) => {
      const card = renderCard<WelcomeCard>(welcomeCard, {
        questions: constants.questions,
      });
      await sendAdaptiveCard(context, card);
    }
  );

  app.message(
    'New chat',
    async (context: TurnContext, state: ApplicationTurnState) => {
      resetConversationHistory(state);
      await context.sendActivity(
        "New chat session started - Previous messages won't be used as context for new queries"
      );
      const card = renderCard<WelcomeCard>(welcomeCard, {
        questions: constants.questions,
      });
      await sendAdaptiveCard(context, card);
    }
  );

  app.activity(
    ActivityTypes.Message,
    async (context: TurnContext, state: ApplicationTurnState) => {
      if (isExampleMessage(context.activity)) resetConversationHistory(state);
      const {text} = context.activity;

      createConversationHistory(state);

      addMessageToConversationHistory(state, {
        content: text,
        role: 'user',
      });

      const chatResponse = await getChatResponse(state.conversation.messages);
      const {data_points, followup_questions} = chatResponse.choices[0].context;
      const {message: reply} = chatResponse.choices[0];

      addMessageToConversationHistory(state, reply);

      const citationFileReferences = getCitations(reply.content);
      const answer = replaceCitations(citationFileReferences, reply.content);
      const citations = convertCitations(citationFileReferences);
      const supportingContent = getSupportingContent(data_points);

      const data: ResponseCard = {
        answer,
        citations,
        supportingContent,
      };
      const card = renderCard<ResponseCard>(responseCard, data);

      await sendAdaptiveCard(context, card, followup_questions);
    }
  );
};

export {setup};
