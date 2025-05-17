"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createEditor, Editor, Transforms, Range } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from 'next-themes';
import {
  Save, Download, Eye, EyeOff, Zap, Sun, Moon, BookOpen,
  Search, RefreshCw, Sparkles, Wand2
} from 'lucide-react';

const lightTheme = {
  pageBg: '#fdfdfd',
  textColor: '#222',
  borderColor: 'rgba(0,0,0,0.08)',
  toolbarBg: '#ffffff',
  shadow: '0 4px 12px rgba(0,0,0,0.06)',
};

const darkTheme = {
  pageBg: '#111316',
  textColor: '#f1f1f1',
  borderColor: 'rgba(255,255,255,0.08)',
  toolbarBg: '#1c1e21',
  shadow: '0 0 0 1px rgba(255,255,255,0.04), 0 4px 12px rgba(255,255,255,0.05)',
};

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.pageBg};
  color: ${({ theme }) => theme.textColor};
  transition: background 0.4s ease, color 0.4s ease;
`;

const Toolbar = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: ${({ theme }) => theme.toolbarBg};
  padding: 1rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 10;
  transition: background 0.3s ease, border 0.3s ease;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background: rgba(100, 100, 255, 0.08);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Book = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  overflow: auto;
  padding: 2rem;
`;

const Page = styled.div`
  background: ${({ theme }) => theme.pageBg};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 16px;
  padding: 3rem;
  width: 900px;
  max-width: 100%;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
`;

const PageNumber = styled.div`
  margin-top: 2rem;
  text-align: right;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textColor};
  opacity: 0.5;
`;

export default function BookEditorPage() {
  const { theme: currentTheme, setTheme } = useTheme();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState([{ type: 'paragraph', children: [{ text: '' }] }]);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("book-content");
    if (saved) {
      try {
        setValue(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse saved content", e);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("book-content", JSON.stringify(value));
  }, [value]);

  const handleSave = () => alert('Content saved.');
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(value)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book-content.json';
    a.click();
  };
 // ...שאר הקוד נשאר זהה עד הפונקציה handleGenerateFromSelection

 async function handleGenerateFromSelection(type) {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return alert("Please select some text.");

  const selectedText = Editor.string(editor, selection);
  if (!/[a-zA-Zא-ת0-9א-ת]/.test(selectedText)) return alert("Please select meaningful text.");

  setLoading(true);
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText, promptType: type })
    });
    const { generated } = await res.json();
    const suggestion = generated.trim();

    const box = document.createElement("div");
    box.style = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: var(--popover, white); color: var(--popover-foreground, black);
      padding: 1.5rem 2rem; border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3); z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
      display: flex; flex-direction: column; align-items: center;
      width: 90%; max-width: 600px; text-align: center;
    `;
    box.innerHTML = `
      <div style="margin-bottom: 1rem; font-size: 1.1rem; font-weight: bold;">AI Suggestion:</div>
      <div style="margin-bottom: 1.25rem; font-size: 1rem; font-weight: 500; white-space: pre-wrap;">${suggestion}</div>
      <div style="display: flex; gap: 1rem;">
        <button id="ai-accept" style="padding:0.6rem 1.2rem;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:0.95rem;cursor:pointer;">✅ Accept</button>
        <button id="ai-reject" style="padding:0.6rem 1.2rem;background:#f44336;color:white;border:none;border-radius:6px;font-size:0.95rem;cursor:pointer;">❌ Reject</button>
      </div>
    `;
    document.body.appendChild(box);
    document.getElementById("ai-accept").onclick = () => {
      if (editor.selection) {
        Transforms.delete(editor, { at: editor.selection });
        Transforms.insertText(editor, suggestion);
      }
      document.body.removeChild(box);
    };
    document.getElementById("ai-reject").onclick = () => {
      document.body.removeChild(box);
    };
  } catch (err) {
    console.error(err);
    alert("AI generation failed.");
  } finally {
    setLoading(false);
  }
}

// ...שאר הקוד ממשיך כרגיל
  const toggleTheme = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeProvider theme={theme}>
      <EditorContainer>
        <Toolbar>
          <ToolButton onClick={handleSave} title="Save"><Save size={16} /></ToolButton>
          <ToolButton onClick={handleExport} title="Export"><Download size={16} /></ToolButton>
          <ToolButton onClick={() => handleGenerateFromSelection("improve")} disabled={loading} title="Improve"><Sparkles size={16} /></ToolButton>
          <ToolButton onClick={() => handleGenerateFromSelection("summarize")} disabled={loading} title="Summarize"><Zap size={16} /></ToolButton>
          <ToolButton onClick={() => handleGenerateFromSelection("expand")} disabled={loading} title="Expand"><Wand2 size={16} /></ToolButton>
          <ToolButton onClick={() => handleGenerateFromSelection("rewrite")} disabled={loading} title="Rewrite"><RefreshCw size={16} /></ToolButton>
          <ToolButton onClick={() => setPreview(!preview)} title={preview ? 'Switch to edit mode' : 'Switch to preview mode'}>
            {preview ? <EyeOff size={16} /> : <Eye size={16} />}
          </ToolButton>
          <ToolButton onClick={toggleTheme} title="Toggle light/dark theme">
            {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </ToolButton>
          <ToolButton title="Outline / Chapters (coming soon)"><BookOpen size={16} /></ToolButton>
          <ToolButton title="Search inside book (coming soon)"><Search size={16} /></ToolButton>
        </Toolbar>
        <Book>
          <Page>
            <Slate editor={editor} initialValue={value} onChange={setValue}>
              <Editable
                readOnly={preview}
                placeholder="Start writing your book..."
                style={{ flex: 1, outline: 'none', lineHeight: '1.8', fontFamily: 'Georgia, serif', fontSize: '1.05rem' }}
              />
            </Slate>
            <PageNumber>Page {page}</PageNumber>
          </Page>
        </Book>
      </EditorContainer>
    </ThemeProvider>
  );
}