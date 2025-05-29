import { QuestionComponentProps } from "./QuestionRenderer";
import { Textarea } from "@/components/ui/textarea";

interface StructuredDetail {
  /* no extra fields */
}

export default function StructuredQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<StructuredDetail>
) {
  return (
    <Textarea
      className="min-h-[120px]"
      value={answer ?? ""}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Write your answer here…"
      disabled={disabled}
    />
  );
}
