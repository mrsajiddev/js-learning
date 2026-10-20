import React from "react";
import { EditorContent, EditorContext } from "@tiptap/react";
import { useMemo } from 'react'

import { MenuBar } from "./MenuBar";
import './styles.css';


export default function TipTap({ editor }) {
  const providerValue = useMemo(() => ({ editor }), [editor]);

  if (!editor) return null;

  return (
    <>
      <EditorContext.Provider value={providerValue}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </>
  );
}