import { Input } from "@/components/ui/input";
import { QuestionComponentProps } from "./QuestionRenderer";

interface SynonymDetail {
  /* no extra fields */
}

export default function SynonymQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<SynonymDetail>
) {
  return (
    <Input
      value={answer ?? ""}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Enter a synonym"
      disabled={disabled}
    />
  );
}
