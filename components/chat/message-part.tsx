import { MyUIMessage } from "@/lib/ai/types";
import { MarkdownContent } from "./markdown-content";

interface MessagePartProps {
  part: any;
  messageRole: MyUIMessage["role"];
  index: number;
}

export function MessagePart({ part, messageRole, index }: MessagePartProps) {
  switch (part.type) {
    case "step-start":
      return null;
    case "text":
      if (!part.text) return null;
      return (
        <div key={index}>
          <MarkdownContent content={part.text} messageRole={messageRole} />
        </div>
      );
    case "tool-understandQuery":
      return (
        <details key={index} className="mt-2">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            View Understand Query tool
          </summary>
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-md space-y-2">
            <div>
              <p className="font-semibold">Initial Question:</p>
              <p>{part.input?.query}</p>
            </div>

            <div>
              <p className="font-semibold">Reformulated Questions:</p>
              <ul>
                {part.output &&
                  part.output.map((o: string, i: number) => (
                    <li key={i}>{o}</li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Full JSON</p>
              {JSON.stringify(part, null, 2)}
            </div>
          </div>
        </details>
      );
    case "tool-getInformation":
      if (!part.output) return null;
      return (
        <details key={index} className="mt-2">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            View Get Information tool
          </summary>
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-md space-y-2">
            <div>
              <p className="font-semibold">{`Retrieved ${part.output.length} document(s) from Vespa:`}</p>
            </div>

            <div>
              <p className="font-semibold">Metadata</p>
              <ul>
                {part.output &&
                  part.output.map(
                    (
                      item: { metadata: Record<string, string | number> },
                      idx: number
                    ) => (
                      <li
                        key={idx}
                      >{`${item.metadata.title} | ${item.metadata.relevance}`}</li>
                    )
                  )}
              </ul>
            </div>
            <div>
              <ul>
                {part.output &&
                  part.output.map(
                    (
                      item: {
                        content: string[];
                        metadata: Record<string, string | number>;
                      },
                      idx: number
                    ) => <li key={idx}>{item.content.slice(30)}</li>
                  )}
              </ul>
            </div>
          </div>
        </details>
      );
    default:
      return (
        <div key={index} className="text-sm text-slate-500">
          Unsupported content type: {JSON.stringify(part, null, 2)}
        </div>
      );
      <div key={index} className="text-sm text-slate-500">
        Unsupported content type: {JSON.stringify(part, null, 2)}
      </div>;
  }
}
