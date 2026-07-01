"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, Heading2 } from "lucide-react";
import { cn } from "@/lib/utils";

function ToolbarItem({
  editor,
  label,
  children,
  isActive,
  onClick,
}: {
  editor: Editor;
  label: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-accent",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

type TipTapEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
};

export function TipTapEditor({
  value,
  onChange,
  placeholder = "Write something…",
  minHeight = "160px",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-content focus:outline-none px-3 py-2",
        style: `min-height: ${minHeight}`,
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-input shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5">
        <ToolbarItem
          editor={editor}
          label="Bold"
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Italic"
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Heading"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Bullet List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarItem>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
