import {ActivityTypes, TurnContext} from 'botbuilder';
import {Application} from '@microsoft/teams-ai';
import {
  resetConversation,
  createChatHistory,
  getChatResponse,
  updateChatHistory,
  getCitations,
  getAnswerText,
  getSupportingContent,
  isExampleMessage,
  renderCard,
  sendAdaptiveCard,
} from './helpers';

import responseCard from './cards/response.json';
import welcomeCard from './cards/welcome.json';

import {ApplicationTurnState, ResponseCard, WelcomeCard} from './types';
import {constants} from './constants';

const setup = (app: Application<ApplicationTurnState>) => {
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
    constants.newChatKeyword,
    async (context: TurnContext, state: ApplicationTurnState) => {
      resetConversation(state);
      await context.sendActivity(constants.newChatMessage);
      const card = renderCard<WelcomeCard>(welcomeCard, {
        questions: constants.questions,
      });
      await sendAdaptiveCard(context, card);
    }
  );

  app.activity(
    ActivityTypes.Message,
    async (context: TurnContext, state: ApplicationTurnState) => {
      if (isExampleMessage(context.activity)) resetConversation(state);

      const chatHistory = createChatHistory(state, context.activity.text);

      const chatResponse = await getChatResponse(
        state.conversation.value.history
      );

      updateChatHistory(
        chatHistory,
        chatHistory.length - 1,
        chatResponse.answer
      );

      const citations = getCitations(chatResponse.answer);
      const answer = getAnswerText(chatResponse.answer, citations);
      const supportingContent = getSupportingContent(chatResponse.data_points);
      const data: ResponseCard = {answer, citations, supportingContent};

      const card = renderCard<ResponseCard>(responseCard, data);

      await sendAdaptiveCard(context, card);
    }
  );
};

export {setup};
