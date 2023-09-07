import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TurnContext } from "botbuilder";
import { ApplicationTurnState, ChatHistory } from "..";
import config from "./config";
import {
    IChatResponse,
    ICitation,
    ISupportingContent,
} from "./interfaces";

// check if message is an example message from the welcome card
export const isExampleMessage = (activity: any) =>
    activity.value && activity.value.messageType === "example";

// render an adaptive card from a template and data
export const renderCard = <T extends object>(template: any, data: T) => {
    return AdaptiveCards.declare<T>(template).render(data);
}

// send an adaptive card to the user
export const sendAdaptiveCard = async (context: TurnContext, card: any) => {
    await context.sendActivity({
        type: 'message',
        attachments: [{
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: card
        }]
    });
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
export const getChatResponse = async (conversation: ChatHistory[], accessToken: string): Promise<IChatResponse> => {
    // call backend
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
                "suggest_followup_questions": false
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
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

// extract text from answer
export const getAnswerText = (answer: string, citations: ICitation[]): string =>
    `${answer.replace(/\[.*?\]/g, '').trim()} ${citations.map((num, index) => `**${index + 1}**`).join(' ')}`

// extract citation filenames into array - text [file.pdf][file.pdf] -> ["file.pdf", "file.pdf"]
export const getCitations = (answer: string): ICitation[] => {
    return answer.match(/\[(.*?)\]/g)
        .map(match => match.slice(1, -1))
        .map(citation => {
            return {
                "filename": citation,
                "url": `${config.appBackendEndpoint}/content/${citation}`
            };
        });
};

// transform data_points array items from strings to objects - "file.pdf: content" -> [{file: file.pdf, content: content}]
export const getSupportingContent = (data_points: string[]): ISupportingContent[] => {
    return data_points.map((value: string) => {
        return {
            "filename": value.split(':')[0],
            "content": value.split(':').splice(1).join(':').trim()
        };
    });
};