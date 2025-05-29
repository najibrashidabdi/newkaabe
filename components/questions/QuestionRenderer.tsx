export interface BaseQuestion {
    id: number;
    text: string;
    points: number;
  }
  
  export interface QuestionStepPayload {
    total: number;
    question_type:
      | "MULTIPLE_CHOICE"
      | "FILL_GAPS"
      | "STRUCTURED"
      | "LABEL_DRAWING"
      | "SYNONYM"
      | "WORD_LIST"
      | "MATCH_WORDS"
      | "COMPOSITION";
    question: BaseQuestion;
    detail: any;                 // narrowed per-component
  }
  
  /* Every concrete component receives:
     { detail, answer, onAnswer(selected), disabled }
  */
  export type QuestionComponentProps<D> = {
    detail: D;
    answer: string | null;
    onAnswer: (val: string) => void;
    disabled: boolean;
  };
  