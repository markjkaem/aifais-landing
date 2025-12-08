"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Download,
  PenTool,
  Loader2,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Settings,
  FileText,
} from "lucide-react";

// --- TYPES ---
type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  vatRate: number; // 0, 9, or 21
};

type InvoiceData = {
  ownName: string;
  ownAddress: string;
  ownKvk: string;
  ownIban: string;
  ownLogo: string | null; // Base64 string
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  expiryDate: string;
  discountPercentage: number;
  notes: string;
};

// --- HELPER: CURRENCY ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export default function AdvancedInvoiceGenerator() {
  // --- STATE ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "settings" | "notes">(
    "content"
  );
  const [isLoaded, setIsLoaded] = useState(false); // Prevent hydration mismatch

  // Initial Defaults
  const defaultData: InvoiceData = {
    ownName: "",
    ownAddress: "",
    ownKvk: "",
    ownIban: "",
    ownLogo: null,
    clientName: "",
    clientAddress: "",
    invoiceNumber: `${new Date().getFullYear()}-001`,
    invoiceDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    discountPercentage: 0,
    notes:
      "Wij verzoeken u vriendelijk het bovenstaande bedrag te voldoen voor de vervaldatum.",
  };

  const defaultItems: InvoiceItem[] = [
    {
      id: "1",
      description: "Consultancy uren",
      quantity: 8,
      price: 85,
      vatRate: 21,
    },
  ];

  const [data, setData] = useState<InvoiceData>(defaultData);
  const [items, setItems] = useState<InvoiceItem[]>(defaultItems);

  // --- LOCAL STORAGE (Load & Save) ---
  useEffect(() => {
    const savedData = localStorage.getItem("invoice_data");
    const savedItems = localStorage.getItem("invoice_items");
    if (savedData) setData(JSON.parse(savedData));
    if (savedItems) setItems(JSON.parse(savedItems));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("invoice_data", JSON.stringify(data));
      localStorage.setItem("invoice_items", JSON.stringify(items));
    }
  }, [data, items, isLoaded]);

  // --- ACTIONS ---
  const handleDataChange = (field: keyof InvoiceData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleDataChange("ownLogo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        price: 0,
        vatRate: 21,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    if (confirm("Weet je zeker dat je alle gegevens wilt wissen?")) {
      setData(defaultData);
      setItems(defaultItems);
      localStorage.removeItem("invoice_data");
      localStorage.removeItem("invoice_items");
    }
  };

  // --- CALCULATIONS ---
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const discountAmount = subtotal * (data.discountPercentage / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;

  // Calculate VAT per rate bucket
  const vatBreakdown = items.reduce((acc, item) => {
    const lineTotal = item.quantity * item.price;
    // Apply discount proportionally to line items for correct VAT calc (simplified method)
    const lineTotalDiscounted = lineTotal * (1 - data.discountPercentage / 100);
    const vatAmount = lineTotalDiscounted * (item.vatRate / 100);

    acc[item.vatRate] = (acc[item.vatRate] || 0) + vatAmount;
    return acc;
  }, {} as Record<number, number>);

  const totalVat = Object.values(vatBreakdown).reduce(
    (acc, val) => acc + val,
    0
  );
  const total = subtotalAfterDiscount + totalVat;

  // --- PDF GENERATION ---
  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [48, 102, 190]; // #3066be

      // 1. HEADER & LOGO
      if (data.ownLogo) {
        doc.addImage(data.ownLogo, "JPEG", 14, 10, 40, 0); // Auto height based on width 40
      }

      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("FACTUUR", 140, 25); // Right aligned visually

      // 2. META DATA
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Factuurnr:`, 140, 35);
      doc.text(data.invoiceNumber, 175, 35);

      doc.text(`Datum:`, 140, 40);
      doc.text(data.invoiceDate, 175, 40);

      doc.text(`Vervaldatum:`, 140, 45);
      doc.text(data.expiryDate, 175, 45);

      // 3. ADDRESSES
      const startY = data.ownLogo ? 55 : 45;

      doc.setFontSize(11);
      doc.setTextColor(0);

      // Left: Sender
      doc.setFont("helvetica", "bold");
      doc.text(data.ownName || "Jouw Bedrijf", 14, startY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(data.ownAddress || "", 14, startY + 5);
      doc.text(`KvK: ${data.ownKvk}`, 14, startY + 10);
      doc.text(`IBAN: ${data.ownIban}`, 14, startY + 15);

      // Right: Client
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Factureren aan:", 140, startY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(data.clientName || "Klant Naam", 140, startY + 5);
      doc.text(data.clientAddress || "", 140, startY + 10);

      // 4. TABLE
      const tableRows = items.map((item) => {
        const lineTotal = item.quantity * item.price;
        return [
          item.description,
          item.quantity,
          `€ ${item.price.toFixed(2)}`,
          `${item.vatRate}%`,
          `€ ${lineTotal.toFixed(2)}`,
        ];
      });

      // @ts-ignore
      autoTable(doc, {
        startY: startY + 30,
        head: [["Omschrijving", "Aantal", "Prijs", "BTW", "Totaal"]],
        body: tableRows,
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: "auto" }, // Description
          4: { halign: "right" }, // Total
        },
      });

      // 5. TOTALS
      // @ts-ignore
      let finalY = (doc as any).lastAutoTable.finalY + 10;

      // Page break check
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }

      const labelX = 130;
      const valueX = 190;

      doc.setFontSize(10);
      doc.text(`Subtotaal:`, labelX, finalY);
      doc.text(`€ ${subtotal.toFixed(2)}`, valueX, finalY, { align: "right" });
      finalY += 6;

      if (data.discountPercentage > 0) {
        doc.setTextColor(200, 0, 0);
        doc.text(`Korting (${data.discountPercentage}%):`, labelX, finalY);
        doc.text(`- € ${discountAmount.toFixed(2)}`, valueX, finalY, {
          align: "right",
        });
        doc.setTextColor(0);
        finalY += 6;
      }

      // VAT Breakdown lines
      Object.entries(vatBreakdown).forEach(([rate, amount]) => {
        if (amount > 0) {
          doc.text(`BTW (${rate}%):`, labelX, finalY);
          doc.text(`€ ${amount.toFixed(2)}`, valueX, finalY, {
            align: "right",
          });
          finalY += 6;
        }
      });

      // Grand Total
      finalY += 2;
      doc.setLineWidth(0.5);
      doc.line(labelX, finalY - 4, valueX, finalY - 4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`TOTAAL:`, labelX, finalY + 2);
      doc.text(`€ ${total.toFixed(2)}`, valueX, finalY + 2, { align: "right" });

      // 6. FOOTER / NOTES
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80);

      const pageHeight = doc.internal.pageSize.height;
      doc.text(data.notes, 14, pageHeight - 30, { maxWidth: 180 });

      doc.save(`Factuur_${data.invoiceNumber || "concept"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Fout bij genereren PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isLoaded) return null; // Avoid flicker

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 p-4 font-sans">
      {/* --- LEFT COLUMN: EDITOR --- */}
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex gap-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === "content"
                ? "bg-[#3066be] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <PenTool className="w-4 h-4" /> Inhoud
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === "settings"
                ? "bg-[#3066be] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-4 h-4" /> Gegevens & Logo
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === "notes"
                ? "bg-[#3066be] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" /> Notities
          </button>
        </div>

        {/* EDITOR FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 min-h-[600px]">
          {/* TAB: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Klant & Datums */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
                    De Klant
                  </p>
                  <input
                    type="text"
                    placeholder="Bedrijfsnaam Klant"
                    value={data.clientName}
                    onChange={(e) =>
                      handleDataChange("clientName", e.target.value)
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3066be] outline-none"
                  />
                  <textarea
                    placeholder="Adres Klant"
                    value={data.clientAddress}
                    onChange={(e) =>
                      handleDataChange("clientAddress", e.target.value)
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3066be] outline-none h-24 resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
                    Details
                  </p>
                  <div>
                    <label className="text-xs text-gray-500">
                      Factuurnummer
                    </label>
                    <input
                      type="text"
                      value={data.invoiceNumber}
                      onChange={(e) =>
                        handleDataChange("invoiceNumber", e.target.value)
                      }
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3066be] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Datum</label>
                      <input
                        type="date"
                        value={data.invoiceDate}
                        onChange={(e) =>
                          handleDataChange("invoiceDate", e.target.value)
                        }
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3066be] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Vervalt</label>
                      <input
                        type="date"
                        value={data.expiryDate}
                        onChange={(e) =>
                          handleDataChange("expiryDate", e.target.value)
                        }
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3066be] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
                    Regels
                  </p>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start group">
                    <div className="flex-grow space-y-1">
                      <input
                        type="text"
                        placeholder="Omschrijving"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md focus:border-[#3066be] outline-none text-sm"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="#"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      className="w-16 p-2 bg-gray-50 border border-gray-200 rounded-md text-center text-sm focus:border-[#3066be] outline-none"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-2 top-2 text-gray-400 text-sm">
                        €
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, "price", Number(e.target.value))
                        }
                        className="w-full p-2 pl-6 bg-gray-50 border border-gray-200 rounded-md text-right text-sm focus:border-[#3066be] outline-none"
                      />
                    </div>
                    <select
                      value={item.vatRate}
                      onChange={(e) =>
                        updateItem(index, "vatRate", Number(e.target.value))
                      }
                      className="w-18 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
                    >
                      <option value={21}>21%</option>
                      <option value={9}>9%</option>
                      <option value={0}>0%</option>
                    </select>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addItem}
                  className="text-xs text-[#3066be] hover:underline font-semibold flex items-center gap-1 mt-2"
                >
                  <Plus className="w-3 h-3" /> Regel toevoegen
                </button>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Korting */}
              <div className="flex justify-end items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  Korting over totaal (%)
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.discountPercentage}
                  onChange={(e) =>
                    handleDataChange(
                      "discountPercentage",
                      Number(e.target.value)
                    )
                  }
                  className="w-20 p-2 bg-gray-50 border border-gray-200 rounded-md text-right"
                />
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
                  Jouw Bedrijf
                </p>

                {/* Logo Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                    {data.ownLogo ? (
                      <img
                        src={data.ownLogo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="text-gray-400 w-8 h-8" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bedrijfslogo</p>
                    <p className="text-xs text-gray-500">
                      Upload een JPG of PNG. Klik op het vak.
                    </p>
                    {data.ownLogo && (
                      <button
                        onClick={() => handleDataChange("ownLogo", null)}
                        className="text-xs text-red-500 mt-1 hover:underline"
                      >
                        Verwijder logo
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Jouw Bedrijfsnaam"
                  value={data.ownName}
                  onChange={(e) => handleDataChange("ownName", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Straat + Nr, Postcode Stad"
                  value={data.ownAddress}
                  onChange={(e) =>
                    handleDataChange("ownAddress", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="KvK Nummer"
                    value={data.ownKvk}
                    onChange={(e) => handleDataChange("ownKvk", e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="IBAN"
                    value={data.ownIban}
                    onChange={(e) =>
                      handleDataChange("ownIban", e.target.value)
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100">
                <button
                  onClick={resetForm}
                  className="text-red-500 text-sm flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" /> Reset alle data
                </button>
              </div>
            </div>
          )}

          {/* TAB: NOTES */}
          {activeTab === "notes" && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider mb-4">
                Footer & Voorwaarden
              </p>
              <textarea
                value={data.notes}
                onChange={(e) => handleDataChange("notes", e.target.value)}
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3066be] outline-none resize-none"
                placeholder="Bijv: Gelieve te betalen binnen 14 dagen..."
              />
              <p className="text-xs text-gray-400 mt-2">
                Deze tekst verschijnt onderaan de factuur.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT COLUMN: PREVIEW --- */}
      <div className="flex flex-col h-full space-y-6">
        {/* A4 Paper Preview */}
        <div className="bg-white text-black rounded-sm shadow-2xl p-8 md:p-12 flex-1 min-h-[700px] relative font-sans text-sm border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              {data.ownLogo ? (
                <img
                  src={data.ownLogo}
                  alt="Logo"
                  className="h-16 object-contain mb-4"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-300 uppercase tracking-widest mb-4">
                  Logo
                </h2>
              )}
              <p className="font-bold text-gray-900">
                {data.ownName || "Jouw Bedrijf"}
              </p>
              <p className="text-gray-500 text-xs">{data.ownAddress}</p>
              <div className="text-gray-500 text-xs mt-2 space-y-0.5">
                <p>{data.ownKvk && `KvK: ${data.ownKvk}`}</p>
                <p>{data.ownIban && `IBAN: ${data.ownIban}`}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-[#3066be] tracking-tight mb-2">
                FACTUUR
              </h1>
              <p className="text-gray-500">#{data.invoiceNumber}</p>
              <p className="text-gray-400 text-xs mt-1">{data.invoiceDate}</p>
            </div>
          </div>

          {/* Address Block */}
          <div className="mb-12">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">
              Factureren aan:
            </p>
            <p className="font-bold text-lg">
              {data.clientName || "Naam Klant"}
            </p>
            <p className="text-gray-600 whitespace-pre-wrap">
              {data.clientAddress || "Adres Klant"}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1">
            <table className="w-full">
              <thead className="bg-[#3066be] text-white">
                <tr>
                  <th className="py-2 px-3 text-left font-semibold text-xs rounded-l-md">
                    Omschrijving
                  </th>
                  <th className="py-2 px-3 text-center font-semibold text-xs w-16">
                    Aantal
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-xs w-24">
                    Prijs
                  </th>
                  <th className="py-2 px-3 text-right font-semibold text-xs w-24 rounded-r-md">
                    Totaal
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 px-3">{item.description || "..."}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Subtotaal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {data.discountPercentage > 0 && (
                <div className="flex justify-between text-red-500 text-xs">
                  <span>Korting ({data.discountPercentage}%)</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              {Object.entries(vatBreakdown).map(
                ([rate, amount]) =>
                  amount > 0 && (
                    <div
                      key={rate}
                      className="flex justify-between text-gray-500 text-xs"
                    >
                      <span>BTW ({rate}%)</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  )
              )}

              <div className="flex justify-between text-lg font-bold text-[#3066be] pt-3 border-t border-gray-100 mt-2">
                <span>Totaal</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            <p>{data.notes}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full bg-[#3066be] hover:bg-[#234a8c] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#3066be]/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Bezig met
              genereren...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" /> Download PDF Factuur
            </>
          )}
        </button>
      </div>
    </div>
  );
}
