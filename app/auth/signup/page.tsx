import { generateAuthMetadata, authPageConfigs } from '../auth-config';
import AuthForm from '../auth-form';

export const metadata = generateAuthMetadata(authPageConfigs.signup);

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
