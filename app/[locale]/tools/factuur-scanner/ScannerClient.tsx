"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Loader2,
  Lock,
  ScanLine,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  ClipboardCheck,
  Download,
  Zap,
  Package,
  Layers,
  X,
} from "lucide-react";

// CHECK JE LINKS!
const LINKS = {
  SINGLE: process.env.STRIPE_LINK_SINGLE || "",
  BATCH_10: process.env.STRIPE_LINK_BATCH10 || "",
  BATCH_20: process.env.STRIPE_LINK_BATCH20 || "",
};

interface ScannedItem {
  id: string;
  leverancier: string;
  factuurdatum: string;
  totaal_incl: number;
  factuurnummer: string;
  kvk_nummer: string;
  [key: string]: any;
}

export default function ScannerClient() {
  const [hasPaid, setHasPaid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Aangepast: Geen 'remaining', maar 'max'
  const [maxScans, setMaxScans] = useState<number>(0);

  const [filesQueue, setFilesQueue] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanIndex, setCurrentScanIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [batchList, setBatchList] = useState<ScannedItem[]>([]);
  const [copied, setCopied] = useState(false);

  // --- INIT & VERIFY ---
  useEffect(() => {
    const initPdfWorker = async () => {
      if (typeof window !== "undefined") {
        try {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        } catch (e) {
          console.error(e);
        }
      }
    };
    initPdfWorker();
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const sid = params.get("session_id");

      if (!sid) {
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch(`/api/verify-session?session_id=${sid}`);
        const data = await res.json();

        // Als data.valid false is (bv omdat user refreshed heeft na 1 scan),
        // dan blijft hasPaid false en ziet hij de paywall. Correct.
        if (data.valid) {
          setHasPaid(true);
          setSessionId(sid);
          setMaxScans(data.maxScans || 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
  }, []);

  // --- LOGICA ---

  const handleFullReset = () => {
    if (typeof window !== "undefined") {
      // Verwijder sessie ID uit URL -> User moet opnieuw betalen
      window.history.pushState({}, "", window.location.pathname);
      window.location.reload(); // Harde reload om state schoon te vegen
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Check Max Cap
      if (filesQueue.length + newFiles.length > maxScans) {
        setError(`Dit pakket heeft een limiet van ${maxScans} bestanden.`);
      } else {
        setError(null);
      }

      // Voeg toe (user mag zelf deleten als het te veel is)
      setFilesQueue((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFileFromQueue = (index: number) => {
    setFilesQueue((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleDeleteFromBatch = (indexToRemove: number) => {
    setBatchList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const processFile = async (
    file: File
  ): Promise<{ base64: string; mimeType: string }> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (file.type === "application/pdf") {
          const pdfjs = await import("pdfjs-dist");
          const uri = URL.createObjectURL(file);
          const loadingTask = pdfjs.getDocument(uri);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas context failed");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport, canvas })
            .promise;
          const dataUrl = canvas.toDataURL("image/png");
          resolve({ base64: dataUrl.split(",")[1], mimeType: "image/png" });
        } else if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              base64: (reader.result as string).split(",")[1],
              mimeType: file.type,
            });
          reader.readAsDataURL(file);
        } else {
          reject("Niet ondersteund.");
        }
      } catch (e: any) {
        reject(e.message);
      }
    });
  };

  // --- BATCH PROCESS ---
  const handleBatchScan = async () => {
    if (filesQueue.length === 0 || !sessionId) return;

    // Harde limiet check vooraf
    if (filesQueue.length > maxScans) {
      setError(
        `Je mag maximaal ${maxScans} bestanden scannen in deze sessie. Verwijder er ${
          filesQueue.length - maxScans
        }.`
      );
      return;
    }

    setIsScanning(true);
    setError(null);
    setCurrentScanIndex(0);

    const queueToProcess = [...filesQueue];
    const processedIndices: number[] = [];

    for (let i = 0; i < queueToProcess.length; i++) {
      setCurrentScanIndex(i + 1);
      const file = queueToProcess[i];

      try {
        const { base64, mimeType } = await processFile(file);

        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Image: base64, mimeType, sessionId }),
        });

        // Als server zegt: 403 -> Limiet bereikt (of sessie ongeldig)
        if (res.status === 403) {
          setError("Sessie limiet bereikt.");
          break;
        }

        const data = await res.json();

        if (!res.ok) {
          console.error(`Fout:`, data.error);
        } else {
          const dataWithId = { ...data, id: Date.now().toString() + i };
          setBatchList((prev) => [...prev, dataWithId]);
          processedIndices.push(i);
        }
      } catch (err) {
        console.error(err);
      }

      await new Promise((r) => setTimeout(r, 500));
    }

    setFilesQueue((prev) =>
      prev.filter((_, idx) => !processedIndices.includes(idx))
    );
    setIsScanning(false);
    setCurrentScanIndex(0);
  };

  // --- EXPORT (Ongewijzigd) ---
  const downloadBatchCSV = () => {
    if (batchList.length === 0) return;
    const allKeys = Array.from(new Set(batchList.flatMap(Object.keys)));
    const headers = allKeys.filter((k) => k !== "id").join(",");
    const rows = batchList
      .map((item) =>
        allKeys
          .filter((k) => k !== "id")
          .map((key) => {
            const val = item[key];
            return typeof val === "string" && val.includes(",")
              ? `"${val}"`
              : val || "";
          })
          .join(",")
      )
      .join("\n");
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodeURI("data:text/csv;charset=utf-8," + headers + "\n" + rows)
    );
    link.setAttribute(
      "download",
      `batch_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    if (batchList.length === 0) return;
    const headers = ["Leverancier", "Datum", "Totaal", "Factuurnr", "KvK"];
    const rows = batchList
      .map(
        (item) =>
          `${item.leverancier}\t${item.factuurdatum}\t${item.totaal_incl
            ?.toFixed(2)
            .replace(".", ",")}\t${item.factuurnummer}\t${item.kvk_nummer}`
      )
      .join("\n");
    navigator.clipboard.writeText(headers.join("\t") + "\n" + rows).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- RENDER ---
  if (isVerifying) {
    return (
      <div className="w-full max-w-xl h-64 flex flex-col items-center justify-center border border-white/10 rounded-3xl bg-black/50 backdrop-blur-md">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-400 text-sm font-medium">
          Sessie controleren...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20 pointer-events-none" />
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        {/* Header */}
        {hasPaid && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-xs font-medium border border-green-900/50">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sessie Geopend</span>
            </div>
            {/* Hier tonen we nu de CAP, niet het saldo */}
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Max {maxScans} scans
            </div>
          </div>
        )}

        {!hasPaid ? (
          // --- PAYWALL ---
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Kies je pakket
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Upload alles in één keer. Pagina verlaten = Sessie voorbij.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Knoppen blijven hetzelfde */}
              <button
                onClick={() => (window.location.href = LINKS.SINGLE)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left"
              >
                <div className="text-blue-400 text-xs font-bold mb-2">
                  LOSSE SCAN
                </div>
                <div className="text-xl font-bold text-white">€ 0,50</div>
              </button>
              <button
                onClick={() => (window.location.href = LINKS.BATCH_10)}
                className="bg-blue-600 hover:bg-blue-500 border border-blue-400 rounded-xl p-4 text-left shadow-lg"
              >
                <div className="text-blue-100 text-xs font-bold mb-2">
                  10 SCANS (BATCH)
                </div>
                <div className="text-xl font-bold text-white">€ 2,50</div>
              </button>
              <button
                onClick={() => (window.location.href = LINKS.BATCH_20)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left"
              >
                <div className="text-purple-400 text-xs font-bold mb-2">
                  20 SCANS (BATCH)
                </div>
                <div className="text-xl font-bold text-white">€ 4,00</div>
              </button>
            </div>
          </div>
        ) : (
          // --- TOOL ---
          <div className="space-y-6">
            {/* Upload Zone (Verdwijnt tijdens scannen) */}
            {!isScanning && (
              <div className="relative group animate-in fade-in duration-300">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*, application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                    filesQueue.length > 0
                      ? "border-blue-500/50 bg-blue-900/10"
                      : "border-white/10 hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-sm text-gray-300">
                      {filesQueue.length > 0
                        ? "Klik om meer toe te voegen"
                        : "Selecteer Batch Bestanden"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max {maxScans} bestanden in deze sessie.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Queue & Acties */}
            {filesQueue.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                  <span>
                    Geselecteerd: {filesQueue.length} / {maxScans}
                  </span>
                  <button
                    onClick={() => setFilesQueue([])}
                    disabled={isScanning}
                    className="hover:text-white"
                  >
                    Alles wissen
                  </button>
                </div>

                {/* Start Knop */}
                <button
                  onClick={handleBatchScan}
                  disabled={isScanning || filesQueue.length > maxScans}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>
                        Verwerken ({currentScanIndex}/{filesQueue.length})...
                      </span>
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-5 h-5" />
                      Start Batch Verwerking
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Resultaten */}
            {batchList.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    Resultaten ({batchList.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition"
                    >
                      {copied ? (
                        <ClipboardCheck className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Gekopieerd!" : "Kopieer"}
                    </button>
                    <button
                      onClick={downloadBatchCSV}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-black font-bold rounded-lg text-xs hover:bg-gray-200 transition"
                    >
                      <Download className="w-3 h-3" />
                      CSV
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-gray-400">
                        <tr>
                          <th className="p-3">Lev.</th>
                          <th className="p-3">Datum</th>
                          <th className="p-3">Totaal</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {batchList.map((item, idx) => (
                          <tr
                            key={idx}
                            className="group hover:bg-white/5 transition"
                          >
                            <td className="p-3 text-white">
                              {item.leverancier}
                            </td>
                            <td className="p-3 text-gray-400">
                              {item.factuurdatum}
                            </td>
                            <td className="p-3 text-green-400">
                              €{item.totaal_incl?.toFixed(2)}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteFromBatch(idx)}
                                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Einde Sessie UI: Als queue leeg is en batch klaar */}
            {hasPaid &&
              batchList.length > 0 &&
              !isScanning &&
              filesQueue.length === 0 && (
                <div className="text-center pt-8 pb-4">
                  <p className="text-gray-500 text-xs mb-2">
                    Klaar met deze sessie? Download je data.
                  </p>
                  <button
                    onClick={handleFullReset}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Sluit Sessie (Data wordt gewist)
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
