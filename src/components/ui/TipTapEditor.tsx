import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string | undefined>;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-2 rounded-lg transition-all duration-200 flex items-center justify-center border',
      isActive
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
        : 'bg-white text-stone-600 border-transparent hover:bg-stone-100',
      disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95',
    )}
  >
    {children}
  </button>
);

const MenuBar = ({
  editor,
  onUploadImage,
}: {
  editor: Editor | null;
  onUploadImage?: (file: File) => Promise<string | undefined>;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (onUploadImage) {
      fileInputRef.current?.click();
    } else {
      const url = window.prompt('URL hình ảnh:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadImage) {
      try {
        const url = await onUploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 rounded-t-xl">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="In đậm"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="In nghiêng"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Gạch ngang"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Tiêu đề 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Tiêu đề 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Tiêu đề 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Danh sách dấu chấm"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Danh sách số"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Trích dẫn"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Chèn hình ảnh">
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Hoàn tác"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Làm lại"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

export function TipTapEditor({ value, onChange, onUploadImage }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-md my-4 max-w-full',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-emerald prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-6 text-stone-800 bg-white rounded-b-xl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync value when initialData loads asynchronously
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col border border-stone-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-50 overflow-hidden transition-all duration-300 shadow-sm">
      <MenuBar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} className="cursor-text" />
    </div>
  );
}
