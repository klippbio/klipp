import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => (
  <div className='flex justify-center h-screen items-center'>
    <SignUp
      redirectUrl="onboarding"
      appearance={{
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case'
        }
      }}
    />
  </div>

);

export default SignUpPage;