interface BedanktPageProps {
  searchParams: Promise<{
    besparing?: string;
    uren?: string;
  }>;
}

export default async function BedanktPage({ searchParams }: BedanktPageProps) {
  const params = await searchParams;

  const besparing =
    params.besparing && params.besparing !== "null"
      ? Number(params.besparing).toLocaleString()
      : null;

  const uren = params.uren || null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Icon / Check */}
        <div className="mx-auto w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-purple-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight">
          Bedankt voor je aanvraag!
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg leading-relaxed">
          We hebben je gegevens ontvangen. Ons team neemt binnen{" "}
          <strong>1 werkdag</strong> contact met je op.
        </p>

        {/* Result Box */}
        {besparing && uren && (
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 mt-4 space-y-4 shadow-xl">
            <p className="text-xl font-medium text-purple-400">
              Jouw Automatiserings-Inzicht
            </p>

            <p className="text-lg">
              Op basis van jouw invoer kan je team ongeveer:
            </p>

            <p className="text-3xl font-bold text-purple-300">
              {uren} uur per week besparen
            </p>

            <p className="text-lg">
              Omgerekend is dat een potentiële jaarlijkse besparing van:
            </p>

            <p className="text-3xl font-bold text-green-400">€{besparing}</p>
          </div>
        )}

        {/* Footer message */}
        <p className="text-gray-400 text-base">
          Mocht je in de tussentijd vragen hebben, neem gerust contact met ons
          op.
        </p>
      </div>
    </div>
  );
}
