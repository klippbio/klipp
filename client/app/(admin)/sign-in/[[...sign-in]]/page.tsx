import { SignIn } from '@clerk/nextjs';

const SignInPage = () => (
  <div className='flex justify-center h-screen items-center'>
    <SignIn
      redirectUrl="dashboard"
      appearance={{
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case'
        }
      }}
    />
  </div>

);

export default SignInPage;
