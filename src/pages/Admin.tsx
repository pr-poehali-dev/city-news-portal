import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsManagement } from '@/components/admin/NewsManagement';
import { EventsManagement } from '@/components/admin/EventsManagement';
import { PlacesManagement } from '@/components/admin/PlacesManagement';
import { MemoryManagement } from '@/components/admin/MemoryManagement';
import { AuthorsManagement } from '@/components/admin/AuthorsManagement';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
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
    eventForm,
    setEventForm,
    placeForm,
    setPlaceForm,
    newsList,
    draftsList,
    eventsList,
    placesList,
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
    handleEventSubmit,
    handleDeleteEvent,
    handlePlaceSubmit,
    handleDeletePlace,
    handleTogglePublishPlace,
    handleToggleFeaturedPlace,
    handleEditPlace,
    handleUpdatePlace,
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
    handleSaveVkDraft
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
    <div className="min-h-screen bg-background pb-safe">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        <Tabs defaultValue="news" className="space-y-4 md:space-y-6">
          <div className="sticky top-[73px] md:top-[81px] z-40 bg-background pb-2 pt-1">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 md:gap-2 h-auto">
              <TabsTrigger value="news" className="text-xs md:text-sm py-2">Новости</TabsTrigger>
              <TabsTrigger value="events" className="text-xs md:text-sm py-2">События</TabsTrigger>
              <TabsTrigger value="places" className="text-xs md:text-sm py-2">Оценил</TabsTrigger>
              <TabsTrigger value="memory" className="text-xs md:text-sm py-2">Помнит</TabsTrigger>
              <TabsTrigger value="authors" className="text-xs md:text-sm py-2">Авторы</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm py-2">Настройки</TabsTrigger>
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
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsManagement
              eventForm={eventForm}
              setEventForm={setEventForm}
              eventsList={eventsList}
              loading={loading}
              onEventSubmit={handleEventSubmit}
              onDeleteEvent={handleDeleteEvent}
            />
          </TabsContent>

          <TabsContent value="places">
            <PlacesManagement
              placeForm={placeForm}
              setPlaceForm={setPlaceForm}
              placesList={placesList}
              loading={loading}
              onPlaceSubmit={handlePlaceSubmit}
              onDeletePlace={handleDeletePlace}
              onTogglePublish={handleTogglePublishPlace}
              onToggleFeatured={handleToggleFeaturedPlace}
              onEditPlace={handleEditPlace}
              onUpdatePlace={handleUpdatePlace}
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