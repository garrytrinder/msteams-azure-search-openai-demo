export type ChatResponse = {
    answer: string;
    data_points: string[];
    thoughts: string;
}

export type WelcomeCard = {
    questions: string[];
}

export type ResponseCard = {
    answer: string;
    citations: Citation[];
    supportingContent: SupportingContent[];
}

export type Citation = {
    filename: string;
    url: string;
}

export type SupportingContent = {
    filename: string;
    content: string;
}