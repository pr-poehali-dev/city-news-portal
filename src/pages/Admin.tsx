import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsManagement } from '@/components/admin/NewsManagement';
import { MemoryManagement } from '@/components/admin/MemoryManagement';
import { AuthorsManagement } from '@/components/admin/AuthorsManagement';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
import { AnalyticsManagement } from '@/components/admin/AnalyticsManagement';
import { YouthNotesManagement } from '@/components/admin/YouthNotesManagement';
import { IndexationAnalytics } from '@/components/admin/IndexationAnalytics';

import { NewsEditDialog } from '@/components/admin/NewsEditDialog';
import { useAdminState } from '@/hooks/use-admin-state';

import { CATEGORIES } from '@/lib/admin-constants';

const Admin = () => {
  
  const {
    loading,
    authenticated,
    loginForm,
    setLoginForm,
    editingNews,
    setEditingNews,
    editDialogOpen,
    setEditDialogOpen,
    newsForm,
    setNewsForm,
    newsList,
    draftsList,
    authorsList,
    authorForm,
    setAuthorForm,
    aboutForm,
    setAboutForm,
    handleLogin,
    handleLogout,
    handleNewsSubmit,
    handleEditNewsOpen,
    handleEditNews,
    handleDeleteNews,
    handlePublishDraft,
    handleSetFeatured,
    memoryForm,
    setMemoryForm,
    memoryList,
    handleMemorySubmit,
    handleDeleteMemory,
    handleTogglePublishMemory,
    handleEditMemory,
    handleUpdateMemory,
    handleAuthorSubmit,
    handleDeleteAuthor,
    handleAboutSubmit,
    handlePublishToTelegram,
    handleSaveVkDraft,
    handleToggleSVO,
    handleToggleShowbiz
  } = useAdminState();

  if (!authenticated) {
    return (
      <LoginForm
        loginForm={loginForm}
        loading={loading}
        onLoginChange={(field, value) => setLoginForm({ ...loginForm, [field]: value })}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pb-safe">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 md:px-8 md:py-12">
        <Tabs defaultValue="news" className="space-y-6 md:space-y-10">
          <div className="sticky top-[97px] md:top-[113px] z-40 bg-white border-b-4 border-primary pb-0">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-0 h-auto bg-transparent rounded-none p-0">
              <TabsTrigger value="news" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Новости</TabsTrigger>
              <TabsTrigger value="memory" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Память</TabsTrigger>
              <TabsTrigger value="youth" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Пульс</TabsTrigger>
              <TabsTrigger value="authors" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Авторы</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Статистика</TabsTrigger>
              <TabsTrigger value="indexation" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white border-r-2 border-primary rounded-none">Индекс</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm py-3 md:py-4 font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white bg-white text-black hover:bg-black hover:text-white rounded-none">Настройки</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="news">
            <NewsManagement
              newsForm={newsForm}
              setNewsForm={setNewsForm}
              newsList={newsList}
              draftsList={draftsList}
              categories={CATEGORIES}
              loading={loading}
              onNewsSubmit={handleNewsSubmit}
              onDeleteNews={handleDeleteNews}
              onSetFeatured={handleSetFeatured}
              onPublishDraft={handlePublishDraft}
              onEditNews={handleEditNewsOpen}
              onPublishToTelegram={handlePublishToTelegram}
              onSaveVkDraft={handleSaveVkDraft}
              onToggleSVO={handleToggleSVO}
              onToggleShowbiz={handleToggleShowbiz}
            />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryManagement
              memoryForm={memoryForm}
              setMemoryForm={setMemoryForm}
              memoryList={memoryList}
              loading={loading}
              onMemorySubmit={handleMemorySubmit}
              onDeleteMemory={handleDeleteMemory}
              onTogglePublish={handleTogglePublishMemory}
              onEditMemory={handleEditMemory}
              onUpdateMemory={handleUpdateMemory}
            />
          </TabsContent>



          <TabsContent value="authors">
            <AuthorsManagement
              authorForm={authorForm}
              setAuthorForm={setAuthorForm}
              authorsList={authorsList}
              loading={loading}
              onAuthorSubmit={handleAuthorSubmit}
              onDeleteAuthor={handleDeleteAuthor}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsManagement loading={loading} />
          </TabsContent>

          <TabsContent value="indexation">
            <IndexationAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement
              aboutForm={aboutForm}
              setAboutForm={setAboutForm}
              loading={loading}
              onAboutSubmit={handleAboutSubmit}
            />
          </TabsContent>
        </Tabs>
      </main>

      <NewsEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        news={editingNews}
        setNews={setEditingNews}
        categories={CATEGORIES}
        loading={loading}
        onSave={handleEditNews}
      />
    </div>
  );
};

export default Admin;