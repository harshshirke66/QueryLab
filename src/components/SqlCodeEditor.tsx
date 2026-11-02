'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Code2, 
  Layers, 
  Terminal, 
  Cpu, 
  CheckCircle2,
  FileCode,
  Zap,
  AlignLeft,
  Database
} from 'lucide-react';

// Dynamically load Monaco with fallback so it never leaves a blank screen
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0B0D10] text-[#969EAA] text-xs font-mono">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
        <span>Loading Monaco engine...</span>
      </div>
    </div>
  ),
});

export interface SqlCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  height?: string;
  minHeight?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  allowMonacoToggle?: boolean;
  dialect?: 'SQL' | 'PostgreSQL' | string;
}

export default function SqlCodeEditor({
  value,
  onChange,
  onRun,
  onSubmit,
  height = '100%',
  minHeight = '280px',
  placeholder = 'Write your SQL query here...',
  readOnly = false,
  className = '',
  allowMonacoToggle = true,
  dialect = 'SQL',
}: SqlCodeEditorProps) {
  // Editor mode: 'native' (instant, lightweight, zero CDN delay) or 'monaco'
  const [editorMode, setEditorMode] = useState<'native' | 'monaco'>('native');
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Split lines for line numbers
  const lines = useMemo(() => {
    return (value || '').split('\n');
  }, [value]);

  const lineCount = Math.max(1, lines.length);

  // Sync scroll between textarea and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update cursor position telemetry (line, column)
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBeforeCursor = value.substring(0, pos);
    const cursorLines = textBeforeCursor.split('\n');
    setCursorPos({
      line: cursorLines.length,
      col: cursorLines[cursorLines.length - 1].length + 1,
    });
  };

  // Copy query to clipboard
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Insert snippet at current cursor position
  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current || readOnly) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const newValue = before + snippet + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + snippet.length;
      textarea.setSelectionRange(newPos, newPos);
      updateCursorPosition();
    }, 10);
  };

  // Simple SQL Formatter to beautify keywords and layout
  const handleFormatSql = () => {
    if (!value.trim() || readOnly) return;
    
    // List of major SQL keywords to uppercase
    const keywords = [
      'select', 'from', 'where', 'group by', 'order by', 'having', 'join', 
      'left join', 'right join', 'inner join', 'outer join', 'cross join', 
      'on', 'as', 'and', 'or', 'not', 'in', 'is', 'null', 'is not null', 
      'like', 'ilike', 'between', 'limit', 'offset', 'union', 'union all', 
      'with', 'case', 'when', 'then', 'else', 'end', 'distinct', 'over', 
      'partition by', 'dense_rank', 'row_number', 'rank', 'coalesce', 
      'count', 'sum', 'avg', 'min', 'max'
    ];

    let formatted = value;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw.toUpperCase());
    });

    onChange(formatted);
  };

  // Smart keyboard handler for Native editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;

    // 1. Run Query: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    // 2. Submit Solution: Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      if (onSubmit) onSubmit();
      return;
    }

    if (readOnly) return;

    // 3. Tab Key: Indent 2 spaces (or Dedent with Shift+Tab)
    if (e.key === 'Tab') {
      e.preventDefault();

      if (e.shiftKey) {
        // Dedent: find beginning of line
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        if (value.substring(lineStart, lineStart + 2) === '  ') {
          const newValue = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, selectionStart - 2);
            textarea.selectionEnd = Math.max(lineStart, selectionEnd - 2);
            updateCursorPosition();
          }, 0);
        }
      } else {
        // Indent: insert 2 spaces
        const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 2;
          textarea.selectionEnd = selectionStart + 2;
          updateCursorPosition();
        }, 0);
      }
      return;
    }

    // 4. Enter Key: Preserve line indentation
    if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(lineStart, selectionStart);
      const match = currentLine.match(/^(\s+)/);
      if (match && match[1]) {
        e.preventDefault();
        const indent = match[1];
        const newValue = value.substring(0, selectionStart) + '\n' + indent + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 1 + indent.length;
          textarea.selectionEnd = selectionStart + 1 + indent.length;
          updateCursorPosition();
        }, 0);
        return;
      }
    }

    // 5. Auto-closing pairs: (), [], '', "", ``
    const pairMap: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      "'": "'",
      '"': '"',
      '`': '`',
    };

    if (pairMap[e.key]) {
      const closeChar = pairMap[e.key];
      // If text selected, wrap it
      if (selectionStart !== selectionEnd) {
        e.preventDefault();
        const selected = value.substring(selectionStart, selectionEnd);
        const newValue = value.substring(0, selectionStart) + e.key + selected + closeChar + value.substring(selectionEnd);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionEnd + 1;
          updateCursorPosition();
        }, 0);
        return;
      }
    }
  };

  return (
    <div 
      className={`relative flex flex-col w-full h-full bg-[#0B0D10] text-[#E2E8F0] select-text overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Editor Sub-Header: Single non-wrapping row */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#11151B] border-b border-[#29313D] text-[11px] select-none shrink-0 gap-2 overflow-hidden">
        
        {/* Left: Quick Snippet Pills in a smooth scrollable strip without visible scrollbar */}
        <div 
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] shrink-0 hidden lg:inline">
            Snippets:
          </span>
          {[
            { label: 'SELECT', snippet: 'SELECT ' },
            { label: 'WHERE', snippet: 'WHERE ' },
            { label: 'GROUP BY', snippet: 'GROUP BY ' },
            { label: 'ORDER BY', snippet: 'ORDER BY ' },
            { label: 'CTE (WITH)', snippet: 'WITH cte AS (\n  SELECT \n)\nSELECT * FROM cte;' },
            { label: 'DENSE_RANK()', snippet: 'DENSE_RANK() OVER (PARTITION BY  ORDER BY )' },
            { label: 'COALESCE()', snippet: 'COALESCE(, 0)' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertSnippet(item.snippet)}
              className="px-2 py-0.5 rounded bg-[#171C24] hover:bg-[#252E3E] text-[#969EAA] hover:text-[#A3E635] border border-[#29313D] font-mono text-[10px] transition-colors whitespace-nowrap shrink-0"
            >
              +{item.label}
            </button>
          ))}
        </div>

        {/* Right: Actions (Format, Copy, Toggle Mode) - pinned and never wrapped */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* Format button */}
          <button
            type="button"
            onClick={handleFormatSql}
            title="Format SQL Keywords"
            className="px-2 py-0.5 rounded border border-[#29313D] bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7] hover:border-[#3E4A5C] transition-colors flex items-center gap-1 font-mono text-[10px]"
          >
            <AlignLeft className="h-3 w-3" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy SQL code"
            className="px-2 py-0.5 rounded border border-[#29313D] bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7] transition-colors flex items-center gap-1 font-mono text-[10px]"
          >
            {copied ? <Check className="h-3 w-3 text-[#A3E635]" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Monaco / Lite Editor Mode Toggle */}
          {allowMonacoToggle && (
            <div className="flex items-center bg-[#0B0D10] border border-[#29313D] rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setEditorMode('native')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 ${
                  editorMode === 'native'
                    ? 'bg-[#171C24] text-[#A3E635] font-semibold border border-[#3E4A5C]'
                    : 'text-[#969EAA] hover:text-[#F4F5F7]'
                }`}
                title="Ultra-fast zero-latency SQL editor"
              >
                <Zap className="h-2.5 w-2.5 text-[#A3E635]" />
                <span>Fast</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorMode('monaco')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 ${
                  editorMode === 'monaco'
                    ? 'bg-[#171C24] text-[#7C9EFF] font-semibold border border-[#3E4A5C]'
                    : 'text-[#969EAA] hover:text-[#F4F5F7]'
                }`}
                title="Switch to Monaco VS Code editor"
              >
                <FileCode className="h-2.5 w-2.5 text-[#7C9EFF]" />
                <span>Monaco</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Editing Surface */}
      <div 
        onClick={() => textareaRef.current?.focus()}
        className="relative flex-1 w-full min-h-[240px] flex overflow-hidden bg-[#0B0D10] cursor-text"
      >
        {editorMode === 'native' ? (
          <div className="flex w-full h-full overflow-hidden">
            {/* Gutter: Line Numbers */}
            <div
              ref={gutterRef}
              aria-hidden="true"
              className="w-11 shrink-0 h-full bg-[#0E1217] border-r border-[#29313D] text-[#4B5563] font-mono text-[12px] text-right pr-2.5 select-none overflow-hidden pointer-events-none py-3"
              style={{
                lineHeight: '22px',
                boxSizing: 'border-box',
              }}
            >
              {Array.from({ length: Math.max(lineCount, 50) }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ height: '22px', lineHeight: '22px' }}
                  className={`transition-colors ${
                    cursorPos.line === i + 1 ? 'text-[#A3E635] font-bold' : ''
                  }`}
                >
                  {i < lineCount ? i + 1 : ''}
                </div>
              ))}
            </div>

            {/* Direct, In-flow, Fully Interactive Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                updateCursorPosition();
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              onScroll={handleScroll}
              placeholder={placeholder}
              readOnly={readOnly}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              rows={Math.max(lineCount + 5, 20)}
              className="flex-1 w-full h-full min-h-full bg-transparent text-[#E2E8F0] font-mono text-[13px] leading-[22px] py-3 px-3.5 resize-none outline-none focus:outline-none border-none overflow-y-auto selection:bg-[#A3E635]/25 caret-[#A3E635]"
              style={{
                fontFamily: 'ui-monospace, "Geist Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '13px',
                lineHeight: '22px',
                tabSize: 2,
                boxSizing: 'border-box',
              }}
            />
          </div>
        ) : (
          /* Monaco Editor Pane with immediate fallback */
          <div className="relative w-full h-full bg-[#0B0D10]">
            <MonacoEditor
              height="100%"
              defaultLanguage="sql"
              value={value}
              onChange={(val) => onChange(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'ui-monospace, "Geist Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                readOnly: readOnly,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        )}
      </div>

      {/* Editor Status Bar / Telemetry */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#0E1217] border-t border-[#29313D] text-[10px] font-mono text-[#64748B] select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[#969EAA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A3E635]" />
            <span className="font-semibold text-[#E2E8F0]">{dialect === 'SQL' ? 'Standard SQL (ANSI)' : 'PostgreSQL 16'}</span>
          </span>
          <span className="text-[#3E4A5C]">|</span>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="hidden sm:inline">
            ({lineCount} {lineCount === 1 ? 'line' : 'lines'}, {value.length} chars)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[#969EAA]">
            <kbd className="px-1 py-0.5 rounded bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-[9px]">Tab</kbd> Indent
          </span>
          <span className="text-[#969EAA]">
            <kbd className="px-1 py-0.5 rounded bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-[9px]">⌘↵</kbd> Run Query
          </span>
        </div>
      </div>
    </div>
  );
}
