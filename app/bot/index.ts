import { ActivityTypes, TurnContext } from "botbuilder";
import { Application } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "..";
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
    getFollowupQuestions
} from "../shared/helpers";

import responseCard from "../shared/cards/response.json";
import welcomeCard from "../shared/cards/welcome.json";

import { ResponseCard, WelcomeCard } from "../shared/types";
import { constants } from "../shared/constants";

const setup = (app: Application) => {

    app.activity(ActivityTypes.InstallationUpdate, async (context: TurnContext) => {
        const card = renderCard<WelcomeCard>(welcomeCard, { questions: constants.questions });
        await sendAdaptiveCard(context, card);
    });

    app.message(constants.newChatMessageKeyword, async (context: TurnContext, state: ApplicationTurnState) => {
        resetConversation(state);
        await context.sendActivity(constants.newChatMessageText);
        const card = renderCard<WelcomeCard>(welcomeCard, { questions: constants.questions });
        await sendAdaptiveCard(context, card);
    });

    app.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
        if (isExampleMessage(context.activity)) resetConversation(state);

        let chatHistory = createChatHistory(state, context.activity.text);

        const chatResponse = await getChatResponse(state.conversation.value.history);
        console.log(new Date().toUTCString());
        console.log(chatResponse.answer);
        console.log(chatResponse.data_points);
        console.log(chatResponse.thoughts);
        chatHistory = updateChatHistory(chatHistory, chatHistory.length - 1, chatResponse.answer);

        const answer = getAnswerText(chatResponse.answer);
        const citations = getCitations(chatResponse.answer);
        const followupQuestions = getFollowupQuestions(chatResponse.answer);
        const supportingContent = getSupportingContent(chatResponse.data_points);
        const data: ResponseCard = { answer, citations, supportingContent };

        const card = renderCard<ResponseCard>(responseCard, data);

        await sendAdaptiveCard(context, card, followupQuestions);
    });
};

export { setup };
