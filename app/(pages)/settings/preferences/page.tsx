import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { FiSettings } from 'react-icons/fi';
import ThemeToggle from '../../../components/ui/theme-toggle';
import SettingsLayout from '../SettingsLayout';

export default function PreferencesPage() {
  return (
    <SettingsLayout>
      <Card className="bg-primary-card border-primary-border">
        <CardHeader>
          <CardTitle className="flex items-center text-primary-foreground">
            <FiSettings className="w-5 h-5 mr-2" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your application experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-primary-foreground">
                Theme
              </h3>
              <p className="text-sm text-primary-text">
                Choose your preferred theme
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
}
