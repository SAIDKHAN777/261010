import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-6xl font-bold mb-4 font-mono">404</h1>
      <p className="text-xl text-zinc-400 mb-8 font-sans">Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
