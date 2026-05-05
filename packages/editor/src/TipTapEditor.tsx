import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { WordCount } from './extensions/wordCount.js';

export interface TipTapEditorProps {
  content: string;
  onChange: (html: string, text: string) => void;
  onWordCount?: (count: number) => void;
  placeholder?: string;
  editable?: boolean;
  editorRef?: React.MutableRefObject<{ getHTML: () => string } | null>;
}

export function TipTapEditor({
  content,
  onChange,
  onWordCount,
  placeholder = '开始写作...',
  editable = true,
  editorRef,
}: TipTapEditorProps) {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      WordCount.configure({
        onUpdate: (count) => {
          setWordCount(count);
          onWordCount?.(count);
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const text = ed.state.doc.textContent;
      onChange(html, text);
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor ? { getHTML: () => editor.getHTML() } : null;
    }
  }, [editor, editorRef]);

  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
  const toggleHeading = useCallback((level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tipTapEditor">
      {editable && (
        <div className="editorToolbar" role="toolbar" aria-label="Formatting toolbar">
          <button onClick={toggleBold} className={editor.isActive('bold') ? 'is-active' : ''} title="粗体">
            <strong>B</strong>
          </button>
          <button onClick={toggleItalic} className={editor.isActive('italic') ? 'is-active' : ''} title="斜体">
            <em>I</em>
          </button>
          <button onClick={toggleUnderline} className={editor.isActive('underline') ? 'is-active' : ''} title="下划线">
            <span style={{ textDecoration: 'underline' }}>U</span>
          </button>
          <span className="toolbarSeparator" />
          <button onClick={() => toggleHeading(1)} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} title="标题1">
            H1
          </button>
          <button onClick={() => toggleHeading(2)} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} title="标题2">
            H2
          </button>
          <button onClick={() => toggleHeading(3)} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} title="标题3">
            H3
          </button>
        </div>
      )}

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <div className="bubbleMenu">
            <button onClick={toggleBold} className={editor.isActive('bold') ? 'is-active' : ''}>
              <strong>B</strong>
            </button>
            <button onClick={toggleItalic} className={editor.isActive('italic') ? 'is-active' : ''}>
              <em>I</em>
            </button>
            <button onClick={toggleUnderline} className={editor.isActive('underline') ? 'is-active' : ''}>
              <span style={{ textDecoration: 'underline' }}>U</span>
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} className="editorContent" />

      <div className="editorStatusBar">
        <span>{wordCount} 字</span>
      </div>
    </div>
  );
}

export default TipTapEditor;
