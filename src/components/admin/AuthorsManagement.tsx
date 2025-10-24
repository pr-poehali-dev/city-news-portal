import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthorForm } from './AuthorForm';
import { AuthorCard } from './AuthorCard';

interface AuthorsManagementProps {
  authorForm: any;
  setAuthorForm: (form: any) => void;
  authorsList: any[];
  loading: boolean;
  onAuthorSubmit: (e: React.FormEvent) => Promise<void>;
  onDeleteAuthor: (id: number) => Promise<void>;
}

export const AuthorsManagement = ({
  authorForm,
  setAuthorForm,
  authorsList,
  loading,
  onAuthorSubmit,
  onDeleteAuthor
}: AuthorsManagementProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить автора</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthorForm
            form={authorForm}
            setForm={setAuthorForm}
            onSubmit={onAuthorSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список авторов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {authorsList.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                onDelete={onDeleteAuthor}
                loading={loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
