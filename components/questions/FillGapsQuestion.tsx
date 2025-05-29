import { Input } from "@/components/ui/input";
import { QuestionComponentProps } from "./QuestionRenderer";

interface FGDetail {
  question_with_gaps: string;              // “… 2 + [gap] = 4”
  answers: { gap_index: number }[];
}

export default function FillGapsQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<FGDetail>
) {
  return (
    <div className="space-y-4">
      <p dangerouslySetInnerHTML={{ __html: detail.question_with_gaps }} />
      <Input
        value={answer ?? ""}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer"
      />
    </div>
  );
}
