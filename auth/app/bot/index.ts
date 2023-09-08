import { ActivityTypes, TurnContext } from 'botbuilder'
import { Application } from '@microsoft/teams-ai'
import { ApplicationTurnState } from '..'
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
} from '../shared/helpers'

import responseCard from '../shared/cards/response.json'
import welcomeCard from '../shared/cards/welcome.json'

import { IResponseCard, IWelcomeCard } from '../shared/interfaces'
import { constants } from '../shared/constants'

const setup = (app: Application) => {
    app.activity(
        ActivityTypes.InstallationUpdate,
        async (context: TurnContext) => {
            const card = renderCard<IWelcomeCard>(welcomeCard, {
                questions: constants.questions,
            })
            await sendAdaptiveCard(context, card)
        }
    )

    app.message(
        'New chat',
        async (context: TurnContext, state: ApplicationTurnState) => {
            resetConversation(state)
            await context.sendActivity(
                `New chat session started - Previous messages won't be used as context for new queries`
            )
            const card = renderCard<IWelcomeCard>(welcomeCard, {
                questions: constants.questions,
            })
            await sendAdaptiveCard(context, card)
        }
    )

    app.activity(
        ActivityTypes.Message,
        async (context: TurnContext, state: ApplicationTurnState) => {
            if (isExampleMessage(context.activity)) resetConversation(state)

            let chatHistory = createChatHistory(state, context.activity.text)

            const chatResponse = await getChatResponse(
                state.conversation.value.history,
                state.temp.value.authToken
            )

            chatHistory = updateChatHistory(
                chatHistory,
                chatHistory.length - 1,
                chatResponse.answer
            )

            const citations = getCitations(chatResponse.answer)
            const answer = getAnswerText(chatResponse.answer, citations)
            const supportingContent = getSupportingContent(
                chatResponse.data_points
            )
            const data: IResponseCard = { answer, citations, supportingContent }

            const card = renderCard<IResponseCard>(responseCard, data)

            await sendAdaptiveCard(context, card)
        }
    )
}

export { setup }
