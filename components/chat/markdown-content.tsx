import { MyUIMessage } from "@/lib/ai/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  messageRole: MyUIMessage["role"];
}

export function MarkdownContent({
  content,
  messageRole,
}: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${
        messageRole === "user"
          ? "prose-invert"
          : "prose-slate dark:prose-invert"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          br: () => <br />,
          pre: ({ children }) => <div>{children}</div>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2 mt-3 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-normal">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-normal">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-4 pl-4 py-2 my-3 italic ${
                messageRole === "user"
                  ? "border-white/30 bg-white/10"
                  : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
              }`}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className={`border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold ${
                messageRole === "user"
                  ? "bg-white/20"
                  : "bg-slate-100 dark:bg-slate-700"
              }`}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:no-underline transition-colors ${
                messageRole === "user"
                  ? "text-blue-200 hover:text-white"
                  : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              }`}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
