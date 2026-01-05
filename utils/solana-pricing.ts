// utils/solana-pricing.ts
// Centrale configuratie voor Solana Pay prijzen

interface PriceData {
    solana: {
        eur: number;
    };
}

// ✅ DEVNET MODE - Zet op true voor testing met gratis SOL
const DEVNET_MODE = false; // ← Mainnet actief!

// ✅ CENTRALE CONFIGURATIE - Pas alleen hier de prijzen aan!
export const PACKAGE_CONFIG = {
    SINGLE: {
        id: "single",
        name: "Losse Scan",
        scans: 1,
        priceEur: 0.50, // ← Wijzig hier je EUR prijs
        // Devnet test prijzen (willekeurige kleine bedragen)
        devnetPriceSol: 0.001,
    },
    BATCH_10: {
        id: "batch10",
        name: "10 Scans",
        scans: 10,
        priceEur: 2.5, // ← Wijzig hier je EUR prijs
        devnetPriceSol: 0.005,
    },
    BATCH_20: {
        id: "batch20",
        name: "20 Scans",
        scans: 20,
        priceEur: 4.0, // ← Wijzig hier je EUR prijs
        devnetPriceSol: 0.01,
    },
} as const;

/**
 * Haal de actuele SOL prijs op in EUR (cached 5 minuten)
 */
export async function getSolPriceInEur(): Promise<number> {
    // ✅ In devnet mode, gebruik een fake prijs
    if (DEVNET_MODE) {
        return 1000; // Fake prijs: €1000/SOL (maakt niet uit voor devnet)
    }

    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur"
        );

        if (!response.ok) throw new Error("CoinGecko API failed");

        const data: PriceData = await response.json();
        return data.solana.eur;
    } catch (error) {
        // ⚠️ Fallback prijs - update deze regelmatig of haal van je eigen API
        return 216.5; // €216.50 per SOL (laatst geupdate: dec 2024)
    }
}

/**
 * Bereken hoeveel SOL nodig is voor een EUR bedrag
 * Voegt automatisch 10% buffer toe voor transaction fees en volatiliteit
 */
export function eurToSol(eurAmount: number, solPriceEur: number): number {
    const sol = eurAmount / solPriceEur;
    const solWithBuffer = sol * 1.10; // ✅ +10% buffer
    // Rond af op 6 decimalen (SOL precision)
    return parseFloat(solWithBuffer.toFixed(6));
}

/**
 * Bereken alle pakket prijzen in SOL (server-side)
 */
export async function calculatePackagePrices() {
    // ✅ In devnet mode, gebruik vaste test prijzen
    if (DEVNET_MODE) {
        return {
            SINGLE: {
                ...PACKAGE_CONFIG.SINGLE,
                priceSol: PACKAGE_CONFIG.SINGLE.devnetPriceSol,
            },
            BATCH_10: {
                ...PACKAGE_CONFIG.BATCH_10,
                priceSol: PACKAGE_CONFIG.BATCH_10.devnetPriceSol,
            },
            BATCH_20: {
                ...PACKAGE_CONFIG.BATCH_20,
                priceSol: PACKAGE_CONFIG.BATCH_20.devnetPriceSol,
            },
            solPriceEur: 1000, // Fake prijs
            lastUpdated: new Date().toISOString(),
            devnetMode: true,
        };
    }

    const solPrice = await getSolPriceInEur();

    return {
        SINGLE: {
            ...PACKAGE_CONFIG.SINGLE,
            priceSol: eurToSol(PACKAGE_CONFIG.SINGLE.priceEur, solPrice),
        },
        BATCH_10: {
            ...PACKAGE_CONFIG.BATCH_10,
            priceSol: eurToSol(PACKAGE_CONFIG.BATCH_10.priceEur, solPrice),
        },
        BATCH_20: {
            ...PACKAGE_CONFIG.BATCH_20,
            priceSol: eurToSol(PACKAGE_CONFIG.BATCH_20.priceEur, solPrice),
        },
        solPriceEur: solPrice,
        lastUpdated: new Date().toISOString(),
        devnetMode: false,
    };
}

/**
 * Verifieer of betaald bedrag overeenkomt met verwacht EUR bedrag
 * Gebruikt 10% marge voor volatiliteit en transaction fees
 */
export function verifyPaymentAmount(
    receivedSol: number,
    expectedSol: number
): boolean {
    const minAcceptable = expectedSol * 0.90; // 10% marge
    const maxAcceptable = expectedSol * 1.10; // 10% marge naar boven

    return receivedSol >= minAcceptable && receivedSol <= maxAcceptable;
}

/**
 * Bepaal hoeveel scans iemand krijgt op basis van betaald SOL bedrag
 */
export async function getScansForAmount(receivedSol: number): Promise<number> {
    // ✅ In devnet mode, match op basis van devnet prijzen
    if (DEVNET_MODE) {
        // Direct match op devnet prijzen (met 10% marge)
        if (verifyPaymentAmount(receivedSol, PACKAGE_CONFIG.BATCH_20.devnetPriceSol)) {
            return PACKAGE_CONFIG.BATCH_20.scans;
        }
        if (verifyPaymentAmount(receivedSol, PACKAGE_CONFIG.BATCH_10.devnetPriceSol)) {
            return PACKAGE_CONFIG.BATCH_10.scans;
        }
        if (verifyPaymentAmount(receivedSol, PACKAGE_CONFIG.SINGLE.devnetPriceSol)) {
            return PACKAGE_CONFIG.SINGLE.scans;
        }

        return 0;
    }

    // Mainnet mode: bereken op basis van actuele SOL prijs
    const solPrice = await getSolPriceInEur();
    const expectedSolSingle = eurToSol(PACKAGE_CONFIG.SINGLE.priceEur, solPrice);
    const expectedSolBatch10 = eurToSol(PACKAGE_CONFIG.BATCH_10.priceEur, solPrice);
    const expectedSolBatch20 = eurToSol(PACKAGE_CONFIG.BATCH_20.priceEur, solPrice);

    // Match naar dichtstbijzijnde pakket (met marge)
    if (verifyPaymentAmount(receivedSol, expectedSolBatch20)) {
        return PACKAGE_CONFIG.BATCH_20.scans;
    }
    if (verifyPaymentAmount(receivedSol, expectedSolBatch10)) {
        return PACKAGE_CONFIG.BATCH_10.scans;
    }
    if (verifyPaymentAmount(receivedSol, expectedSolSingle)) {
        return PACKAGE_CONFIG.SINGLE.scans;
    }

    // Geen match gevonden
    return 0;
}