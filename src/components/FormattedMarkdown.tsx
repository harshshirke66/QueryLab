'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export default function FormattedMarkdown({ content, className = '' }: FormattedMarkdownProps) {
  if (!content) return null;

  return (
    <div className={`formatted-markdown text-xs leading-relaxed text-[#E2E8F0] space-y-2.5 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-extrabold text-[#F4F5F7] mt-3 mb-1.5 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-[#F4F5F7] mt-3 mb-1.5 tracking-tight border-b border-[#29313D]/60 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-[#A3E635] font-mono uppercase tracking-wider mt-2.5 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs leading-relaxed text-[#E2E8F0] mb-2 font-normal">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[#F4F5F7]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#A3E635]">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-2 text-xs text-[#E2E8F0] pl-1 marker:text-[#A3E635]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-2 text-xs text-[#E2E8F0] pl-1 marker:text-[#A3E635] font-mono">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs leading-relaxed text-[#E2E8F0]">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#A3E635] pl-3 py-1.5 my-2.5 text-xs italic text-[#969EAA] bg-[#171C24]/40 rounded-r-lg">
              {children}
            </blockquote>
          ),
          pre: ({ children, ...props }: any) => (
            <pre
              className="p-3 my-2.5 rounded-xl bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-[#A3E635] overflow-x-auto leading-relaxed"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }: any) => {
            const isCodeBlock =
              Boolean(className && className.includes('language-')) ||
              (typeof children === 'string' && children.includes('\n'));
            if (!isCodeBlock) {
              return (
                <code
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#171C24] text-[#A3E635] border border-[#29313D] mx-0.5 font-normal"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono text-[11px] text-[#A3E635] ${className || ''}`} {...props}>
                {children}
              </code>
            );
          },
          a: ({ href, children, ...props }: any) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A3E635] underline underline-offset-2 hover:brightness-110 transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-[#29313D]">
              <table className="w-full text-left font-mono text-[11px] divide-y divide-[#29313D]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#171C24] text-[#A3E635] font-bold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#29313D] bg-[#0B0D10]/80">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#171C24]/60 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2 font-bold text-left border-r border-[#29313D] last:border-r-0 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-[#E2E8F0] border-r border-[#29313D] last:border-r-0 leading-relaxed">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

