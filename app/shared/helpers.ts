import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { ActionTypes, ActivityTypes, SuggestedActions, TurnContext } from "botbuilder";
import { ApplicationTurnState, ChatHistory } from "..";
import config from "./config";
import {
    ChatResponse,
    Citation,
    SupportingContent,
} from "./types";
import { constants } from "./constants";

// check if message is an example message from the welcome card
export const isExampleMessage = (activity: any) =>
    activity.value && activity.value.messageType === constants.exampleMessageType;

// render an adaptive card from a template and data
export const renderCard = <T extends object>(template: any, data: T) => {
    return AdaptiveCards.declare<T>(template).render(data);
}

// send an adaptive card to the user
export const sendAdaptiveCard = async (context: TurnContext, card: any, suggestions?: string[]) => {
    const suggestedActions: SuggestedActions = suggestions && suggestions.length !== 0
        ? createSuggestedActions(suggestions, context.activity.from.id)
        : { actions: [], to: [] };

    await context.sendActivity({
        type: ActivityTypes.Message,
        suggestedActions,
        attachments: [{
            contentType: constants.adaptiveCardContentType,
            content: card
        }]
    });
}

// create suggested actions from followup questions
export const createSuggestedActions = (suggestions: string[], recipientId: string): SuggestedActions => {
    return {
        actions: suggestions.map(suggestion => {
            return {
                type: ActionTypes.ImBack,
                title: suggestion,
                text: suggestion,
                displayText: suggestion,
                value: suggestion
            };
        }),
        to: [recipientId]
    };
}

// reset conversation history
export const resetConversation = (state: ApplicationTurnState): void => state.conversation.delete();

// create conversation history if not exists
export const createChatHistory = (state: ApplicationTurnState, text: string): ChatHistory[] => {
    state.conversation.value.history = state.conversation.value.history || [];
    state.conversation.value.history.push({ user: text });
    return state.conversation.value.history;
}

// call backend to get chat response
export const getChatResponse = async (conversation: ChatHistory[]): Promise<ChatResponse> => {
    // send request to backend
    const response = await fetch(`${config.appBackendEndpoint}/chat`, {
        method: 'POST',
        body: JSON.stringify({
            "history": conversation,
            "approach": "rrr",
            "overrides": {
                "retrieval_mode": "hybrid",
                "semantic_ranker": true,
                "semantic_captions": false,
                "top": 3,
                "suggest_followup_questions": true
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // get response data
    return await response.json();
};

// update previous history entry with answer from bot 
export const updateChatHistory = (chatHistory: ChatHistory[], indexToUpdate: number, answer: string): ChatHistory[] => {
    return [
        ...chatHistory,
        chatHistory[indexToUpdate] = {
            user: chatHistory[indexToUpdate].user,
            bot: answer
        }
    ];
};

// extract answer text from answer
export const getAnswerText = (answer: string): string =>
    replaceCitationsWithReferences(removeFollowupQuestions(answer));

// remove citations from answer - text [citation] -> text
const removeCitations = (answer: string): string => answer.replace(/\[.*?\]/g, '').trim();

// remove followup questions from answer - text <<question>> -> text
const removeFollowupQuestions = (answer: string): string => {
    const possibleIndex = answer.indexOf(constants.possibleFollowupQuestionText);
    if (possibleIndex >= 0) return answer.substring(0, possibleIndex);

    const nextIndex = answer.indexOf(constants.nextQuestionText);
    if (nextIndex >= 0) return answer.substring(0, nextIndex);

    return answer;
}

// add citation references to answer - text [citation] -> text **1**
const replaceCitationsWithReferences = (answer: string): string => {
    const matches = answer.match(/\[(.*?)\]/g);
    const result = Array.from(new Set(matches));

    answer = answer.replace(/\[.*?\]/g, (citation) => {
        const index = result.indexOf(citation);
        return ` [${index + 1}](${config.appBackendEndpoint}/content/${citation.replace(/\[|\]/g, '')})`;
    });

    return answer;
}

// extract the followup questions from answer - text <<question>> -> ["question"]
export const getFollowupQuestions = (answer: string): string[] => {
    const possibleIndex = answer.indexOf(constants.possibleFollowupQuestionText);
    if (possibleIndex >= 0) return answer.match(/<<([^>]*)>>/g);

    const nextIndex = answer.indexOf(constants.nextQuestionText);
    if (nextIndex >= 0) return [];
}

// extract citation filenames into array - text [file.pdf][file.pdf] -> ["file.pdf", "file.pdf"]
export const getCitations = (answer: string): Citation[] => {
    const matches = removeFollowupQuestions(answer)
        .match(/\[(.*?)\]/g)
        .map(match => match.replace(/\[|\]/g, ''));
    const result = Array.from(new Set(matches));

    return result.length !== 0
        ? result.map(citation => {
            return {
                "filename": citation,
                "url": `${config.appBackendEndpoint}/content/${citation}`
            };
        }) : [];
};

// transform data_points array items from strings to objects - "file.pdf: content" -> [{file: file.pdf, content: content}]
export const getSupportingContent = (data_points: string[]): SupportingContent[] => {
    return data_points.map((value: string) => {
        return {
            "filename": value.split(':')[0],
            "content": value.split(':').splice(1).join(':').trim()
        };
    });
};
