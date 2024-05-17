'use client';
import { useRouter } from 'next/navigation';
function HomePage() {
  const router = useRouter();
  router.push('/auth/login');

  return (
    <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div>
        <h1 className="text-5xl text-white">Home Page</h1>
      </div>
    </section>
  );
}
export default HomePage;
