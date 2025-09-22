import { generateAuthMetadata, authPageConfigs } from '../auth-config';
import AuthForm from '../auth-form';

export const metadata = generateAuthMetadata(authPageConfigs.signin);

export default function SigninPage() {
  return <AuthForm mode="signin" />;
}
