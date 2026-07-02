"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";
import YouTubeExtension from "@tiptap/extension-youtube";
import { VideoNode } from "./video-node";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Strikethrough,
  Code,
  Quote,
  Link,
  Underline,
  ImageIcon,
  Video,
  Film,
  Undo,
  Redo,
} from "lucide-react";
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
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline underline-offset-2" },
      }),
      UnderlineExtension,
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      YouTubeExtension.configure({
        inline: false,
        allowFullscreen: true,
        width: 640,
        height: 360,
      }),
      VideoNode,
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
          label="Underline"
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Strikethrough"
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </ToolbarItem>
        <span className="mx-1 h-5 w-px bg-border" />
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
        <ToolbarItem
          editor={editor}
          label="Ordered List"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Blockquote"
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Code"
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Image"
          isActive={editor.isActive("image")}
          onClick={() => {
            const url = window.prompt("Image URL");
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="YouTube"
          isActive={editor.isActive("youtube")}
          onClick={() => {
            const url = window.prompt("YouTube video URL");
            if (!url) return;
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
        >
          <Film className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Video"
          isActive={editor.isActive("video")}
          onClick={() => {
            const url = window.prompt("Video URL (mp4/webm)");
            if (!url) return;
            editor.chain().focus().setVideo({ src: url }).run();
          }}
        >
          <Video className="size-4" />
        </ToolbarItem>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarItem
          editor={editor}
          label="Link"
          isActive={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL", editor.getAttributes("link").href ?? "");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          <Link className="size-4" />
        </ToolbarItem>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarItem
          editor={editor}
          label="Undo"
          isActive={false}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="size-4" />
        </ToolbarItem>
        <ToolbarItem
          editor={editor}
          label="Redo"
          isActive={false}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="size-4" />
        </ToolbarItem>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
