import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mt-4 mb-6">
          Pagina niet gevonden
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
          Het lijkt erop dat deze automatisering nog niet bestaat. Misschien
          zocht je naar één van deze pagina's?
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Terug naar Home
          </Link>
          <Link
            href="/diensten"
            className="px-6 py-3 border border-gray-500 text-gray-400 font-semibold rounded-xl hover:bg-gray-900/20 transition"
          >
            Onze Diensten
          </Link>
        </div>
      </div>
    </div>
  );
}
