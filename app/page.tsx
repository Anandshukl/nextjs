import ModernNav from "./components/ModernNav";

export default function Home() {
  return (
    <main className="p-10">
      <ModernNav />
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Community Platform</h1>
        <p className="mt-4 text-gray-500">
          Share ideas, write blogs, and connect with people.
        </p>

        <div className="flex gap-4 mt-6">
          <a href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
            Get Started
          </a>

          <a href="/login" className="border px-4 py-2 rounded">
            Login
          </a>
        </div>
      </section>
    </main>
  );
}
