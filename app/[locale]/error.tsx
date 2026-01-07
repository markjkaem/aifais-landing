'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
                Er ging iets mis
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
                We hebben de fout geregistreerd en werken aan een oplossing.
            </p>
            <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Probeer opnieuw
            </button>
        </div>
    );
}
