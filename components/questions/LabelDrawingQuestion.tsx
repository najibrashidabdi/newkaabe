/* ────────────────────────────────────────────────────────────
   Label-the-diagram question (client)
────────────────────────────────────────────────────────────── */
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { QuestionComponentProps } from "./QuestionRenderer";

interface LabelDrawingDetail {
  image: string; // URL served by Django, e.g., "/media/label_drawing/diagram.png"
  labels?: { label: string; answer?: string }[]; // answers hidden for students
}

// Optional: API base fallback if not using env
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LabelDrawingQuestion(
  { detail, answer, onAnswer, disabled }: QuestionComponentProps<LabelDrawingDetail>
) {
  // Parse student's current answer
  let state: Record<string, string> = {};
  try {
    state = answer ? JSON.parse(answer) : {};
  } catch {
    // ignore bad JSON
  }

  function setGap(lbl: string, val: string) {
    const next = { ...state, [lbl]: val };
    onAnswer(JSON.stringify(next));
  }

  const labels = Array.isArray(detail?.labels) ? detail.labels : [];

  // Handle missing or empty image URLs
  const imageUrl = detail?.image
    ? detail.image.startsWith("http")
      ? detail.image
      : `${BASE_URL}${detail.image}`
    : null;

  return (
    <div className="space-y-4">
      {/* diagram */}
      <div className="relative w-full h-56">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Label-the-diagram"
            fill
            className="object-contain rounded-xl border"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground border rounded-xl">
            No diagram image provided.
          </div>
        )}
      </div>

      {/* label inputs */}
      {labels.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {labels.map(({ label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-medium">{label}</span>
              <Input
                value={state[label] ?? ""}
                onChange={(e) => setGap(label, e.target.value)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No labels were supplied for this question.
        </p>
      )}
    </div>
  );
}
