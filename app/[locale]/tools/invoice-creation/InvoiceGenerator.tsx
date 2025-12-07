"use client";

import { useState } from "react";
import { Plus, Trash2, Download, PenTool, Loader2 } from "lucide-react";

export default function InvoiceGenerator() {
  // --- STATE ---
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState({
    ownName: "",
    ownAddress: "",
    ownKvk: "",
    ownIban: "",
    clientName: "",
    clientAddress: "",
    invoiceNumber: new Date().getFullYear() + "-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const [items, setItems] = useState([
    { description: "Consultancy uren", quantity: 1, price: 85, vat: 21 },
  ]);

  // --- CALCULATIONS ---
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const vatAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.price * (item.vat / 100),
    0
  );
  const total = subtotal + vatAmount;

  // --- ACTIONS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0, vat: 21 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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

      // 1. STYLING (Professional Black/White)
      const primaryColor = [20, 20, 20];

      // Header
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("FACTUUR", 14, 20);

      // Meta Info
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Factuurnummer: ${data.invoiceNumber}`, 140, 20);
      doc.text(`Factuurdatum: ${data.invoiceDate}`, 140, 25);
      doc.text(`Vervaldatum: ${data.expiryDate}`, 140, 30);

      // Sender & Receiver
      doc.setFontSize(11);
      doc.setTextColor(0);

      // Links: Afzender
      doc.setFont("helvetica", "bold");
      doc.text(data.ownName || "Jouw Bedrijf", 14, 45);
      doc.setFont("helvetica", "normal");
      doc.text(data.ownAddress || "Straat 123, 1000AA Stad", 14, 50);
      doc.text(`KvK: ${data.ownKvk}`, 14, 55);
      doc.text(`IBAN: ${data.ownIban}`, 14, 60);

      // Rechts: Klant
      doc.setFont("helvetica", "bold");
      doc.text("Factureren aan:", 140, 45);
      doc.setFont("helvetica", "normal");
      doc.text(data.clientName || "Klant Naam", 140, 50);
      doc.text(data.clientAddress || "Klant Adres", 140, 55);

      // Table
      const tableRows = items.map((item) => [
        item.description,
        item.quantity,
        `€ ${item.price.toFixed(2)}`,
        `${item.vat}%`,
        `€ ${(item.quantity * item.price).toFixed(2)}`,
      ]);

      // @ts-ignore
      autoTable(doc, {
        startY: 75,
        head: [["Omschrijving", "Aantal", "Prijs", "BTW", "Totaal"]],
        body: tableRows,
        headStyles: {
          fillColor: primaryColor as any,
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: { fontSize: 10, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Totals Block
      // @ts-ignore
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      const labelX = 130;
      const valueX = 190;

      doc.text(`Subtotaal:`, labelX, finalY);
      doc.text(`€ ${subtotal.toFixed(2)}`, valueX, finalY, { align: "right" });

      doc.text(`BTW (21%):`, labelX, finalY + 5);
      doc.text(`€ ${vatAmount.toFixed(2)}`, valueX, finalY + 5, {
        align: "right",
      });

      doc.setFont("helvetica", "bold");
      doc.text(`TOTAAL:`, labelX, finalY + 12);
      doc.text(`€ ${total.toFixed(2)}`, valueX, finalY + 12, {
        align: "right",
      });

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        "Gelieve te betalen voor de vervaldatum o.v.v. het factuurnummer.",
        14,
        280
      );

      doc.save(`factuur_${data.invoiceNumber}.pdf`);
    } catch (e) {
      console.error("PDF Generatie Fout:", e);
      alert("Er ging iets mis met het maken van de PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      {/* --- LINKER KOLOM: INPUT (Light Theme) --- */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-8 h-fit">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="p-2 bg-[#3066be]/10 rounded-lg text-[#3066be]">
            <PenTool className="w-5 h-5" />
          </div>
          <h3 className="text-gray-900 font-bold text-lg">Factuurgegevens</h3>
        </div>

        {/* Jouw Gegevens */}
        <div className="space-y-4">
          <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
            Jouw Bedrijf
          </p>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="ownName"
              placeholder="Bedrijfsnaam"
              onChange={handleChange}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
            />
            <input
              type="text"
              name="ownKvk"
              placeholder="KvK Nummer"
              onChange={handleChange}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
            />
          </div>
          <input
            type="text"
            name="ownAddress"
            placeholder="Straat + Huisnummer, Postcode Stad"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
          />
          <input
            type="text"
            name="ownIban"
            placeholder="IBAN Rekeningnummer"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
          />
        </div>

        {/* Klant Gegevens */}
        <div className="space-y-4">
          <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
            De Klant
          </p>
          <input
            type="text"
            name="clientName"
            placeholder="Naam Klant / Bedrijf"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
          />
          <input
            type="text"
            name="clientAddress"
            placeholder="Adres Klant"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:border-[#3066be] focus:ring-1 focus:ring-[#3066be] outline-none w-full transition"
          />
        </div>

        {/* Factuur Meta */}
        <div className="space-y-4">
          <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
            Details
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nummer</label>
              <input
                type="text"
                name="invoiceNumber"
                value={data.invoiceNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-[#3066be] outline-none w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Datum</label>
              <input
                type="date"
                name="invoiceDate"
                value={data.invoiceDate}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-[#3066be] outline-none w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Vervalt
              </label>
              <input
                type="date"
                name="expiryDate"
                value={data.expiryDate}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-[#3066be] outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Regels */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#3066be] uppercase font-bold tracking-wider">
              Producten / Diensten
            </p>
            <button
              onClick={addItem}
              className="text-xs text-[#3066be] hover:text-[#234a8c] font-semibold flex items-center gap-1 bg-[#3066be]/5 px-2 py-1 rounded transition"
            >
              <Plus className="w-3 h-3" /> Regel toevoegen
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="Omschrijving"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 w-full focus:border-[#3066be] outline-none"
              />
              <input
                type="number"
                placeholder="#"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 w-16 text-center focus:border-[#3066be] outline-none"
              />
              <input
                type="number"
                placeholder="Prijs"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value))
                }
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 w-24 text-right focus:border-[#3066be] outline-none"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-3 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- RECHTER KOLOM: PREVIEW & ACTIE (Paper Look) --- */}
      <div className="flex flex-col h-full space-y-6">
        {/* Live Preview Card - Paper Effect */}
        <div className="bg-white text-black rounded-sm shadow-xl p-12 flex-1 min-h-[600px] relative overflow-hidden font-sans text-sm border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                FACTUUR
              </h2>
              <p className="text-gray-500 font-medium">#{data.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                {data.ownName || "Jouw Bedrijf"}
              </p>
              <p className="text-gray-600">{data.ownAddress}</p>
              <p className="text-gray-600 text-xs mt-1">
                {data.ownKvk && `KvK: ${data.ownKvk}`}
              </p>
              <p className="text-gray-600 text-xs">
                {data.ownIban && `IBAN: ${data.ownIban}`}
              </p>
            </div>
          </div>

          {/* Client Info Block */}
          <div className="mb-12 flex justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold mb-2 tracking-wide">
                Factureren aan
              </p>
              <p className="font-bold text-lg">
                {data.clientName || "Klant Naam"}
              </p>
              <p className="text-gray-600">{data.clientAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase font-bold mb-2 tracking-wide">
                Datum
              </p>
              <p className="font-medium text-gray-900 mb-4">
                {data.invoiceDate}
              </p>

              <p className="text-gray-400 text-xs uppercase font-bold mb-2 tracking-wide">
                Vervaldatum
              </p>
              <p className="font-medium text-gray-900">{data.expiryDate}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-12">
            <thead>
              <tr className="text-left text-gray-500 border-b-2 border-gray-100">
                <th className="pb-4 font-semibold uppercase text-xs tracking-wider">
                  Omschrijving
                </th>
                <th className="pb-4 text-center font-semibold uppercase text-xs tracking-wider">
                  Aantal
                </th>
                <th className="pb-4 text-right font-semibold uppercase text-xs tracking-wider">
                  Prijs
                </th>
                <th className="pb-4 text-right font-semibold uppercase text-xs tracking-wider">
                  Totaal
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 font-medium">
                    {item.description || "Nieuw product"}
                  </td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">€ {item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    € {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotaal</span>
                <span>€ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>BTW (21%)</span>
                <span>€ {vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-gray-900 mt-4">
                <span>Totaal</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="absolute bottom-12 left-12 right-12 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-400 text-xs">
              Bedankt voor de samenwerking. Gelieve te betalen voor de
              vervaldatum.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full bg-[#3066be] hover:bg-[#234a8c] text-white font-bold py-5 rounded-2xl shadow-lg shadow-[#3066be]/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Momentje...
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
