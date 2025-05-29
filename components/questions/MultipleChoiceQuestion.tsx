import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionComponentProps } from "./QuestionRenderer";

interface MCQDetail {
  options: { option_label: string; option_text: string }[];
}

export default function MultipleChoiceQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<MCQDetail>
) {
  return (
    <RadioGroup
      value={answer ?? ""}
      onValueChange={onAnswer}
      className="space-y-3"
      disabled={disabled}
    >
      {detail.options.map((o) => (
        <div key={o.option_label} className="flex items-center space-x-2">
          <RadioGroupItem id={o.option_label} value={o.option_text} />
          <Label htmlFor={o.option_label} className="flex-1">
            {o.option_text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
