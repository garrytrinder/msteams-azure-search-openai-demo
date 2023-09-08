import {AdaptiveCards} from '@microsoft/adaptivecards-tools';
import {Activity, ActivityTypes, TurnContext} from 'botbuilder';
import config from './config';
import {
  ApplicationTurnState,
  ChatHistory,
  ChatResponse,
  Citation,
  SupportingContent,
} from './types';
import {constants} from './constants';

// check if message is an example message from the welcome card
export const isExampleMessage = (activity: Activity) =>
  activity.value && activity.value.messageType === constants.exampleMessageType;

// render an adaptive card from a template and data
export const renderCard = <T extends object>(
  template: unknown,
  data: T
): unknown => {
  return AdaptiveCards.declare<T>(template).render(data);
};

// send an adaptive card to the user
export const sendAdaptiveCard = async (context: TurnContext, card: unknown) => {
  await context.sendActivity({
    type: ActivityTypes.Message,
    attachments: [
      {
        contentType: constants.adaptiveCardContentType,
        content: card,
      },
    ],
  });
};

// reset conversation history
export const resetConversation = (state: ApplicationTurnState): void =>
  state.conversation.delete();

// create conversation history if not exists
export const createChatHistory = (
  state: ApplicationTurnState,
  text: string
): ChatHistory[] => {
  state.conversation.value.history = state.conversation.value.history || [];
  state.conversation.value.history.push({user: text});
  return state.conversation.value.history;
};

// call backend to get chat response
export const getChatResponse = async (
  conversation: ChatHistory[]
): Promise<ChatResponse> => {
  const response = await fetch(`${config.appBackendEndpoint}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      history: conversation,
      approach: 'rrr',
      overrides: {
        retrieval_mode: 'hybrid',
        semantic_ranker: true,
        semantic_captions: false,
        top: 3,
        suggest_followup_questions: false,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

// update previous history entry with answer from bot
export const updateChatHistory = (
  chatHistory: ChatHistory[],
  indexToUpdate: number,
  answer: string
): ChatHistory[] => {
  return [
    ...chatHistory,
    (chatHistory[indexToUpdate] = {
      user: chatHistory[indexToUpdate].user,
      bot: answer,
    }),
  ];
};

// extract text from answer
export const getAnswerText = (answer: string, citations: Citation[]): string =>
  `${answer.replace(/\[.*?\]/g, '').trim()} ${citations
    .map((num, index) => `**${index + 1}**`)
    .join(' ')}`;

// extract citation filenames into array - text [file.pdf][file.pdf] -> ["file.pdf", "file.pdf"]
export const getCitations = (answer: string): Citation[] | [] => {
  const matches = answer.match(/\[(.*?)\]/g);
  return matches
    ? matches
        .map(match => match.slice(1, -1))
        .map(citation => {
          return {
            filename: citation,
            url: `${config.appBackendEndpoint}/content/${citation}`,
          };
        })
    : [];
};

// transform data_points array items from strings to objects - "file.pdf: content" -> [{file: file.pdf, content: content}]
export const getSupportingContent = (
  data_points: string[]
): SupportingContent[] => {
  return data_points.map((value: string) => {
    return {
      filename: value.split(':')[0],
      content: value.split(':').splice(1).join(':').trim(),
    };
  });
};
