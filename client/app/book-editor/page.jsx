"use client";
// import '../style/BookEditor.css'; // Assuming you have this
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  gap: 0.75rem;
  background: ${({ theme }) => theme.toolbarBg};
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 10;
  transition: background 0.3s ease, border 0.3s ease;
  align-items: center;
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background: rgba(100, 100, 255, 0.06);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const AIPromptButton = styled(ToolButton)`
  background-color: #f0f0f0;
  color: ${({ theme }) => theme.textColor};
  border-color: ${({ theme }) => theme.borderColor};
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const Book = styled.div`
  display: flex;
  flex-direction: column; /* Arrange pages vertically */
  align-items: center; /* Center pages horizontally */
  flex: 1;
  overflow-y: auto; /* Enable vertical scrolling for the 'book' */
  padding: 2rem;
  gap: 2rem; /* Spacing between pages */
`;

const Page = styled.div`
  background: ${({ theme }) => theme.pageBg};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 3rem;
  width: 850px;
  max-width: 95%; /* Adjust max-width for responsiveness */
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  min-height: 1100px; /* Simulate a standard page height (adjust as needed) */
`;

const PageNumber = styled.div`
  margin-top: 1.5rem;
  text-align: right;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textColor};
  opacity: 0.6;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const AIModal = styled.div`
  background: ${({ theme }) => theme.toolbarBg};
  color: ${({ theme }) => theme.textColor};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  max-width: 80%;
  width: 500px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`;

const ModalButton = styled(ToolButton)`
  margin: 0 0.5rem;
`;

export default function BookEditorPage() {
  const { theme: currentTheme, setTheme } = useTheme();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState([{ type: 'paragraph', children: [{ text: '' }] }]);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

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

  async function handleGenerateFromSelection(type) {
    const { selection } = editor;
    if (!selection || Range.isCollapsed(selection)) {
      alert("Please select some text.");
      return;
    }

    const selectedText = Editor.string(editor, selection);
    if (!/[a-zA-Zא-ת0-9א-ת]/.test(selectedText)) {
      alert("Please select meaningful text.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, promptType: type })
      });
      const { generated } = await res.json();
      setAiSuggestion(generated.trim());
    } catch (err) {
      console.error(err);
      alert("AI generation failed.");
    } finally {
      setLoading(false);
    }
  }

  const handleAcceptAISuggestion = () => {
    if (editor.selection && aiSuggestion) {
      Transforms.delete(editor, { at: editor.selection });
      Transforms.insertText(editor, aiSuggestion);
    }
    setAiSuggestion(null);
  };

  const handleRejectAISuggestion = () => {
    setAiSuggestion(null);
  };

  const toggleTheme = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeProvider theme={theme}>
      <EditorContainer>
        <Toolbar>
          <ToolbarGroup>
            <ToolButton onClick={handleSave} title="Save your work"><Save size={16} /></ToolButton>
            <ToolButton onClick={handleExport} title="Download as JSON"><Download size={16} /></ToolButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <AIPromptButton onClick={() => handleGenerateFromSelection("improve")} disabled={loading} title="Improve the selected text"><Sparkles size={16} /></AIPromptButton>
            <AIPromptButton onClick={() => handleGenerateFromSelection("summarize")} disabled={loading} title="Summarize the selected text"><Zap size={16} /></AIPromptButton>
            <AIPromptButton onClick={() => handleGenerateFromSelection("expand")} disabled={loading} title="Expand on the selected text"><Wand2 size={16} /></AIPromptButton>
            <AIPromptButton onClick={() => handleGenerateFromSelection("rewrite")} disabled={loading} title="Rewrite the selected text"><RefreshCw size={16} /></AIPromptButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolButton onClick={() => setPreview(!preview)} title={preview ? 'Switch to edit mode' : 'Switch to preview mode'}>
              {preview ? <EyeOff size={16} /> : <Eye size={16} />}
            </ToolButton>
            <ToolButton onClick={toggleTheme} title="Toggle light/dark theme">
              {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </ToolButton>
            <ToolButton disabled title="Outline / Chapters (coming soon)"><BookOpen size={16} /></ToolButton>
            <ToolButton disabled title="Search inside book (coming soon)"><Search size={16} /></ToolButton>
          </ToolbarGroup>
        </Toolbar>

        <Book>
          <Page>
            <Slate editor={editor} initialValue={value} onChange={setValue}>
              <Editable
                readOnly={preview}
                placeholder="Start writing your book..."
                style={{
                  flex: 1,
                  outline: 'none',
                  lineHeight: '1.7',
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.05rem',
                  minHeight: 'calc(100% - 2rem)', /* Ensure Editable takes up page height */
                }}
              />
            </Slate>
            <PageNumber>Page {page}</PageNumber>
          </Page>
          {/* You can dynamically add more <Page> components here if needed */}
        </Book>

        {aiSuggestion && (
          <ModalOverlay onClick={() => setAiSuggestion(null)}>
            <AIModal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>AI Suggestion:</ModalTitle>
              <ModalText>{aiSuggestion}</ModalText>
              <div>
                <ModalButton onClick={handleAcceptAISuggestion}>✅ Accept</ModalButton>
                <ModalButton onClick={handleRejectAISuggestion}>❌ Reject</ModalButton>
              </div>
            </AIModal>
          </ModalOverlay>
        )}
      </EditorContainer>
    </ThemeProvider>
  );
}