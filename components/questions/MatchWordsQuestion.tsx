import { Checkbox } from "@/components/ui/checkbox";
import { QuestionComponentProps } from "./QuestionRenderer";

interface MatchWordsDetail {
  pairs: { left_item: string; right_item: string }[];
}

export default function MatchWordsQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<MatchWordsDetail>
) {
  /* same serialisation trick */
  const chosen: Record<string, string> =
    answer ? Object.fromEntries(answer.split("|").map(p => p.split("="))) : {};

  function toggle(left: string, right: string) {
    const key = `${left}=${right}`;
    const exists = chosen[left] === right;
    const next = { ...chosen };
    if (exists) delete next[left];
    else next[left] = right;
    onAnswer(Object.entries(next).map(([l, r]) => `${l}=${r}`).join("|"));
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {detail.pairs.map(({ left_item, right_item }) => {
        const checked = chosen[left_item] === right_item;
        return (
          <label
            key={left_item}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggle(left_item, right_item)}
              disabled={disabled}
            />
            <span className="flex-1">{left_item} — {right_item}</span>
          </label>
        );
      })}
    </div>
  );
}
