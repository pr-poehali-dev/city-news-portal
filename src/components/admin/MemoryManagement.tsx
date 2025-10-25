import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface MemoryForm {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  year: number | string;
  decade: string;
  event_date: string;
  image_url: string;
  is_published: boolean;
}

interface MemoryManagementProps {
  memoryForm: MemoryForm;
  setMemoryForm: (form: MemoryForm) => void;
  memoryList: any[];
  loading: boolean;
  onMemorySubmit: () => void;
  onDeleteMemory: (id: number) => void;
  onTogglePublish: (id: number, isPublished: boolean) => void;
  onEditMemory: (memory: any) => void;
  onUpdateMemory: () => void;
}

export function MemoryManagement({
  memoryForm,
  setMemoryForm,
  memoryList,
  loading,
  onMemorySubmit,
  onDeleteMemory,
  onTogglePublish,
  onEditMemory,
  onUpdateMemory,
}: MemoryManagementProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{memoryForm.id ? 'Редактировать статью' : 'Добавить статью'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="memory-title">Название события</Label>
              <Input
                id="memory-title"
                value={memoryForm.title}
                onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                placeholder="Например: Открытие первого завода"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-year">Год</Label>
              <Input
                id="memory-year"
                type="number"
                value={memoryForm.year}
                onChange={(e) => setMemoryForm({ ...memoryForm, year: e.target.value })}
                placeholder="1945"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-decade">Десятилетие</Label>
              <Input
                id="memory-decade"
                value={memoryForm.decade}
                onChange={(e) => setMemoryForm({ ...memoryForm, decade: e.target.value })}
                placeholder="1940-е"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="memory-date">Точная дата (необязательно)</Label>
              <Input
                id="memory-date"
                type="date"
                value={memoryForm.event_date}
                onChange={(e) => setMemoryForm({ ...memoryForm, event_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memory-excerpt">Краткое описание</Label>
            <Textarea
              id="memory-excerpt"
              value={memoryForm.excerpt}
              onChange={(e) => setMemoryForm({ ...memoryForm, excerpt: e.target.value })}
              placeholder="Краткое описание исторического события..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memory-content">Полная история</Label>
            <Textarea
              id="memory-content"
              value={memoryForm.content}
              onChange={(e) => setMemoryForm({ ...memoryForm, content: e.target.value })}
              placeholder="Подробная история события..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memory-image">Историческое фото</Label>
            <div className="flex gap-2">
              <Input
                id="memory-image"
                value={memoryForm.image_url}
                onChange={(e) => setMemoryForm({ ...memoryForm, image_url: e.target.value })}
                placeholder="https://... или загрузите файл"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = reader.result as string;
                      try {
                        const response = await fetch('https://functions.poehali.dev/bc882f30-e97a-4dcc-aca0-a79cffa9bd71', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64, filename: file.name })
                        });
                        const data = await response.json();
                        if (data.url) {
                          setMemoryForm({ ...memoryForm, image_url: data.url });
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить
              </Button>
            </div>
            {memoryForm.image_url && (
              <img src={memoryForm.image_url} alt="Preview" className="w-full h-48 object-cover rounded mt-2 sepia" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="memory-published"
              checked={memoryForm.is_published}
              onCheckedChange={(checked) => setMemoryForm({ ...memoryForm, is_published: checked })}
            />
            <Label htmlFor="memory-published">Опубликовать</Label>
          </div>

          <Button 
            onClick={memoryForm.id ? onUpdateMemory : onMemorySubmit} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? 'Сохранение...' : (memoryForm.id ? 'Обновить' : 'Добавить статью')}
          </Button>
          
          {memoryForm.id && (
            <Button 
              onClick={() => setMemoryForm({
                title: '',
                excerpt: '',
                content: '',
                year: '',
                decade: '',
                event_date: '',
                image_url: '',
                is_published: false
              })} 
              variant="outline" 
              className="w-full"
            >
              Отменить редактирование
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список статей ({memoryList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memoryList.map((memory) => (
              <div key={memory.id} className="flex items-start gap-4 p-4 border rounded-lg">
                {memory.image_url && (
                  <img
                    src={memory.image_url}
                    alt={memory.title}
                    className="w-20 h-20 object-cover rounded sepia"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{memory.title}</h3>
                    <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">
                      {memory.year} • {memory.decade}
                    </span>
                    {!memory.is_published && (
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        Черновик
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{memory.excerpt}</p>
                </div>
                <div className="flex gap-2 flex-col">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditMemory(memory)}
                    >
                      <Icon name="Edit" size={16} className="mr-1" />
                      Редактировать
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTogglePublish(memory.id, !memory.is_published)}
                    >
                      {memory.is_published ? 'Скрыть' : 'Опубликовать'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteMemory(memory.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {memoryList.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Нет добавленных статей
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
