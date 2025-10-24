import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import ApplyForm from './ApplyForm';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Apply to become a Merchant</h1>
        <p className="text-gray-600 mb-8">
          Fill out the application below. Our team will review your submission,
          and you'll receive an email once it's approved.
        </p>
        <ApplyForm userEmail={session.user.email || ''} />
      </div>
    </div>
  );
}
