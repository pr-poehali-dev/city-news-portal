import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Начните писать новость...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = () => {
    const url = prompt('Вставьте URL изображения:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const uploadImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('https://cdn.poehali.dev/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        const imageUrl = data.url || data.file_url;

        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Ошибка загрузки изображения');
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Заголовок"
        >
          <Icon name="Heading2" size={16} />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Подзаголовок"
        >
          <Icon name="Heading3" size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Жирный"
        >
          <Icon name="Bold" size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Курсив"
        >
          <Icon name="Italic" size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Маркированный список"
        >
          <Icon name="List" size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Нумерованный список"
        >
          <Icon name="ListOrdered" size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Цитата"
        >
          <Icon name="Quote" size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={addImage}
          title="Вставить изображение по URL"
        >
          <Icon name="Image" size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={uploadImage}
          title="Загрузить изображение"
        >
          <Icon name="Upload" size={16} />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Отменить"
        >
          <Icon name="Undo" size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Вернуть"
        >
          <Icon name="Redo" size={16} />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
