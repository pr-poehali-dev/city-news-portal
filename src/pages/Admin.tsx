import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsManagement } from '@/components/admin/NewsManagement';
import { EventsManagement } from '@/components/admin/EventsManagement';
import { PlacesManagement } from '@/components/admin/PlacesManagement';
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
    handleAuthorSubmit,
    handleDeleteAuthor,
    handleAboutSubmit
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
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="places">Город оценил</TabsTrigger>
            <TabsTrigger value="authors">Авторы</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

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