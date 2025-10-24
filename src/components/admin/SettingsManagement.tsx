import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AboutForm } from './AboutForm';

interface SettingsManagementProps {
  aboutForm: any;
  setAboutForm: (form: any) => void;
  loading: boolean;
  onAboutSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SettingsManagement = ({
  aboutForm,
  setAboutForm,
  loading,
  onAboutSubmit
}: SettingsManagementProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>О портале</CardTitle>
        </CardHeader>
        <CardContent>
          <AboutForm
            form={aboutForm}
            setForm={setAboutForm}
            onSubmit={onAboutSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
