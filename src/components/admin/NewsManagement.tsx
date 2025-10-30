import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsForm } from './NewsForm';
import { NewsCard } from './NewsCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewsManagementProps {
  newsForm: any;
  setNewsForm: (form: any) => void;
  newsList: any[];
  draftsList: any[];
  categories: string[];
  loading: boolean;
  onNewsSubmit: (e: React.FormEvent, isDraft?: boolean) => Promise<void>;
  onDeleteNews: (id: number) => Promise<void>;
  onSetFeatured: (id: number) => Promise<void>;
  onPublishDraft: (draft: any) => Promise<void>;
  onEditNews: (news: any) => void;
  onPublishToTelegram: (news: any) => Promise<void>;
  onSaveVkDraft: (news?: any) => Promise<void>;
  onToggleSVO?: (id: number) => Promise<void>;
  onToggleShowbiz?: (id: number) => Promise<void>;
}

export const NewsManagement = ({
  newsForm,
  setNewsForm,
  newsList,
  draftsList,
  categories,
  loading,
  onNewsSubmit,
  onDeleteNews,
  onSetFeatured,
  onPublishDraft,
  onEditNews,
  onPublishToTelegram,
  onSaveVkDraft,
  onToggleSVO,
  onToggleShowbiz
}: NewsManagementProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <NewsForm
        newsForm={newsForm}
        categories={categories}
        loading={loading}
        onFormChange={(field, value) => setNewsForm({ ...newsForm, [field]: value })}
        onSubmit={onNewsSubmit}
        onSaveVkDraft={() => onSaveVkDraft()}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Опубликованные новости</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto">
            {newsList.map((news) => (
              <NewsCard
                key={news.id}
                news={news}
                loading={loading}
                onEdit={onEditNews}
                onDelete={onDeleteNews}
                onSetFeatured={onSetFeatured}
                onPublishToTelegram={onPublishToTelegram}
                onSaveVkDraft={() => onSaveVkDraft(news)}
                onToggleSVO={onToggleSVO}
                onToggleShowbiz={onToggleShowbiz}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Черновики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto">
            {draftsList.map((draft) => (
              <NewsCard
                key={draft.id}
                news={draft}
                isDraft
                loading={loading}
                onEdit={onEditNews}
                onDelete={onDeleteNews}
                onPublish={onPublishDraft}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};