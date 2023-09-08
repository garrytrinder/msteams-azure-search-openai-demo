import {DefaultTempState, DefaultTurnState} from '@microsoft/teams-ai';

export type ConversationState = {
  history: ChatHistory[];
};

export type ApplicationTurnState = DefaultTurnState<
  ConversationState,
  DefaultTurnState,
  DefaultTempState
>;

export type ChatHistory = {
  bot?: string;
  user: string;
};

export type ChatResponse = {
  answer: string;
  data_points: string[];
  thoughts: string;
};

export type WelcomeCard = {
  questions: string[];
};

export type ResponseCard = {
  answer: string;
  citations: Citation[];
  supportingContent: SupportingContent[];
};

export type Citation = {
  filename: string;
  url: string;
};

export type SupportingContent = {
  filename: string;
  content: string;
};
