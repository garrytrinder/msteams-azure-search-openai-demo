export interface IChatResponse {
  answer: string;
  data_points: string[];
  thoughts: string;
}

export interface IWelcomeCard {
  questions: string[];
}

export interface IResponseCard {
  answer: string;
  citations: ICitation[];
  supportingContent: ISupportingContent[];
}

export interface ICitation {
  filename: string;
  url: string;
}

export interface ISupportingContent {
  filename: string;
  content: string;
}
