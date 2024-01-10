import {AdaptiveCards} from '@microsoft/adaptivecards-tools';
import {Activity, TurnContext} from 'botbuilder';
import {ApplicationTurnState} from '..';
import config from './config';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  Citation,
  SupportingContent,
} from './types';

// check if message is an example message from the welcome card
export const isExampleMessage = (activity: Activity) =>
  activity.value && activity.value.messageType === 'example';

// render an adaptive card from a template and data
export const renderCard = <T extends object>(template: unknown, data: T) => {
  return AdaptiveCards.declare<T>(template).render(data);
};

// send an adaptive card to the user with suggested actions (if any)
export const sendAdaptiveCard = async (
  context: TurnContext,
  card: unknown,
  suggestions?: string[]
) => {
  await context.sendActivity({
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: card,
      },
    ],
    suggestedActions: {
      to: [context.activity.from.id],
      actions: suggestions?.map(suggestion => {
        return {
          type: 'imBack',
          title: suggestion,
          value: suggestion,
        };
      }),
    },
  });
};

// reset conversation history
export const resetConversationHistory = (state: ApplicationTurnState): void =>
  state.deleteConversationState();

// create conversation history if not exists
export const createConversationHistory = (
  state: ApplicationTurnState
): ChatMessage[] =>
  (state.conversation.messages = state.conversation.messages || []);

export const addMessageToConversationHistory = (
  state: ApplicationTurnState,
  message: ChatMessage
): number => state.conversation.messages.push(message);

// call backend to get chat response
export const getChatResponse = async (
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  const chatPayload: ChatRequest = {
    context: {
      overrides: {
        retrieval_mode: 'hybrid',
        semantic_ranker: true,
        semantic_captions: false,
        suggest_followup_questions: true,
        top: 3,
        use_groups_security_filter: false,
        use_oid_security_filter: false,
      },
    },
    messages,
    session_state: null,
    stream: false,
  };

  const response = await fetch(`${config.appBackendEndpoint}/chat`, {
    method: 'POST',
    body: JSON.stringify(chatPayload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

// extract citation filenames into array - text [file.pdf][file.pdf] -> ["file.pdf", "file.pdf"]
export const getCitations = (content: string): string[] => {
  const matches = content.match(/\[(.*?)\]/g);
  if (matches) {
    const uniqueMatches = Array.from(
      new Set(matches.map(match => match.slice(1, -1)))
    );
    return uniqueMatches;
  }
  return [];
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

// replace citations with numbers in reply text - [file.pdf][file.pdf] -> **1** **2**
export const replaceCitations = (
  citations: string[],
  content: string
): string => {
  citations.forEach((citation, index) => {
    const regex = new RegExp(`\\[${citation}\\]`, 'g');
    content = content.replace(regex, `**${index + 1}**`);
  });
  // add space between citations - **1****2** -> **1** **2**
  return content.replace(/\*\*\*\*/g, '** **');
};

// convert citation filenames to objects - ["file.pdf", "file.pdf"] -> [{filename: "file.pdf", url: "https://..."}, {filename: "file.pdf", url: "https://..."}]
export const convertCitations = (citations: string[]): Citation[] => {
  return citations.map(citation => {
    return {
      filename: citation,
      url: `${config.appBackendEndpoint}/content/${citation}`,
    };
  });
};
