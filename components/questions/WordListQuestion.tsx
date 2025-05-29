import { Input } from "@/components/ui/input";
import { QuestionComponentProps } from "./QuestionRenderer";

interface WordListDetail {
  text_with_gaps: string;                // “… lived in [gap1] when…”
  options: { word: string }[];
  answers: { gap_identifier: string }[]; // sent only for teachers / after submit
}

export default function WordListQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<WordListDetail>
) {
  /* store answers as "gapId=word,gapId2=word2…" so we stay string-based */
  const dict: Record<string, string> =
    answer ? Object.fromEntries(answer.split("|").map(p => p.split("="))) : {};

  function handleSelect(gap: string, word: string) {
    const next = { ...dict, [gap]: word };
    onAnswer(Object.entries(next).map(([g, w]) => `${g}=${w}`).join("|"));
  }

  return (
    <div className="space-y-6">
      <p dangerouslySetInnerHTML={{ __html: detail.text_with_gaps }} />

      <div className="grid gap-2 sm:grid-cols-2">
        {detail.options.map(({ word }) => (
          <button
            key={word}
            className={`border rounded px-3 py-2 text-left ${
              Object.values(dict).includes(word)
                ? "bg-primary/10 border-primary"
                : ""
            }`}
            onClick={() => {
              // pick the first unfilled gap
              const gap = detail.answers
                .map((a) => a.gap_identifier)
                .find((g) => !dict[g]);
              if (gap && !disabled) handleSelect(gap, word);
            }}
            disabled={disabled}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
