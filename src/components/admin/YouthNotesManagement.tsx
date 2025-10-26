import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface YouthNote {
  id: number;
  title: string;
  content: string;
  emoji: string;
  color: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

interface YouthNotesManagementProps {
  loading: boolean;
}

const EMOJI_OPTIONS = ['✨', '🎉', '🔥', '⚡', '🎸', '🎨', '🎮', '☕', '🏃', '🎓', '💡', '🚀', '🌟', '💪', '🎯'];
const COLOR_OPTIONS = [
  { name: 'Фиолетовый', value: '#8B5CF6' },
  { name: 'Розовый', value: '#ec4899' },
  { name: 'Синий', value: '#3b82f6' },
  { name: 'Зелёный', value: '#22c55e' },
  { name: 'Оранжевый', value: '#f97316' },
  { name: 'Бирюзовый', value: '#06b6d4' },
  { name: 'Пурпурный', value: '#a855f7' },
  { name: 'Красный', value: '#ef4444' },
];

const FUNCTIONS_URL = 'https://functions.poehali.dev/97a5ec9d-d662-4652-be23-350205ec6759';

export function YouthNotesManagement({ loading }: YouthNotesManagementProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<YouthNote[]>([]);
  const [editingNote, setEditingNote] = useState<YouthNote | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    emoji: '✨',
    color: '#8B5CF6',
    is_published: true,
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  const loadNotes = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  useState(() => {
    loadNotes();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const url = editingNote 
        ? `${FUNCTIONS_URL}?id=${editingNote.id}`
        : FUNCTIONS_URL;
      
      const method = editingNote ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save note');

      toast({
        title: 'Успешно',
        description: editingNote ? 'Заметка обновлена' : 'Заметка создана'
      });

      setFormData({ title: '', content: '', emoji: '✨', color: '#8B5CF6', is_published: true, image_url: '' });
      setEditingNote(null);
      loadNotes();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить заметку',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (note: YouthNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      emoji: note.emoji,
      color: note.color,
      is_published: note.is_published,
      image_url: note.image_url || ''
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить заметку?')) return;

    try {
      const response = await fetch(`${FUNCTIONS_URL}?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Успешно',
        description: 'Заметка удалена'
      });

      loadNotes();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заметку',
        variant: 'destructive'
      });
    }
  };

  const handleTogglePublish = async (note: YouthNote) => {
    try {
      const response = await fetch(`${FUNCTIONS_URL}?id=${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !note.is_published })
      });

      if (!response.ok) throw new Error('Failed to toggle publish');

      toast({
        title: 'Успешно',
        description: note.is_published ? 'Заметка снята с публикации' : 'Заметка опубликована'
      });

      loadNotes();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус',
        variant: 'destructive'
      });
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', emoji: '✨', color: '#8B5CF6', is_published: true, image_url: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Выберите изображение',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://functions.poehali.dev/e006b73d-c2a8-4b5e-bfb3-9ee0e3fca4cc', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      setFormData(prev => ({ ...prev, image_url: data.url }));

      toast({
        title: 'Успешно',
        description: 'Фото загружено'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            {editingNote ? 'Редактировать заметку' : 'Новая заметка для молодёжи'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Короткий и цепляющий заголовок"
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="content">Текст заметки *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Короткое описание события или новости для молодёжи"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length}/500 символов
              </p>
            </div>

            <div>
              <Label htmlFor="image">Фото (опционально)</Label>
              <div className="space-y-2">
                {formData.image_url && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="h-32 w-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-xs text-muted-foreground">Загрузка...</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Эмодзи</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <Button
                      key={emoji}
                      type="button"
                      variant={formData.emoji === emoji ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, emoji })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Цвет акцента</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLOR_OPTIONS.map(color => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-2"
                      style={{
                        borderColor: formData.color === color.value ? color.value : 'transparent',
                        backgroundColor: `${color.value}20`
                      }}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                    >
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Опубликовать сразу
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Icon name={editingNote ? 'Save' : 'Plus'} size={16} className="mr-2" />
                {editingNote ? 'Сохранить' : 'Создать заметку'}
              </Button>
              {editingNote && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Отмена
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Опубликованные заметки ({notes.filter(n => n.is_published).length})</span>
            <Button variant="ghost" size="sm" onClick={loadNotes}>
              <Icon name="RefreshCw" size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notes.filter(n => n.is_published).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Нет опубликованных заметок
              </p>
            ) : (
              notes.filter(n => n.is_published).map(note => (
                <Card key={note.id} style={{ borderLeft: `4px solid ${note.color}` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <div className="text-2xl">{note.emoji}</div>
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{note.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Clock" size={12} />
                            {new Date(note.created_at).toLocaleString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(note)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePublish(note)}
                        >
                          <Icon name="EyeOff" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {notes.filter(n => !n.is_published).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Черновики ({notes.filter(n => !n.is_published).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notes.filter(n => !n.is_published).map(note => (
                <Card key={note.id} className="opacity-60" style={{ borderLeft: `4px solid ${note.color}` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <div className="text-2xl">{note.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold">{note.title}</h4>
                            <Badge variant="secondary" className="text-xs">Черновик</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(note)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePublish(note)}
                        >
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}