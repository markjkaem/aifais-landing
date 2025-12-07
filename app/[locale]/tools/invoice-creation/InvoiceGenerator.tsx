"use client";

import { useState } from "react";
import { Plus, Trash2, Download, PenTool, Loader2 } from "lucide-react";

export default function InvoiceGenerator() {
  // --- STATE ---
  const [isGenerating, setIsGenerating] = useState(false); // Nieuw: voorkomt dubbelklikken

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
    if (isGenerating) return; // Extra veiligheid
    setIsGenerating(true);

    try {
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();

      // 1. ZWART-WIT STYLING
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
      setIsGenerating(false); // Zet knop weer aan
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* --- LINKER KOLOM: INPUT --- */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
          <PenTool className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-bold">Factuurgegevens</h3>
        </div>

        {/* Jouw Gegevens */}
        <div className="space-y-4">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Jouw Gegevens
          </p>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="ownName"
              placeholder="Jouw Bedrijfsnaam"
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
            />
            <input
              type="text"
              name="ownKvk"
              placeholder="KvK Nummer"
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
            />
          </div>
          <input
            type="text"
            name="ownAddress"
            placeholder="Straat + Huisnummer, Postcode Stad"
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
          />
          <input
            type="text"
            name="ownIban"
            placeholder="IBAN Rekeningnummer"
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
          />
        </div>

        {/* Klant Gegevens */}
        <div className="space-y-4">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            De Klant
          </p>
          <input
            type="text"
            name="clientName"
            placeholder="Naam Klant / Bedrijf"
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
          />
          <input
            type="text"
            name="clientAddress"
            placeholder="Adres Klant"
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-gray-500 outline-none w-full"
          />
        </div>

        {/* Factuur Meta */}
        <div className="space-y-4">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Details
          </p>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="invoiceNumber"
              value={data.invoiceNumber}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gray-500 outline-none w-full"
            />
            <input
              type="date"
              name="invoiceDate"
              value={data.invoiceDate}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gray-500 outline-none w-full"
            />
            <input
              type="date"
              name="expiryDate"
              value={data.expiryDate}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gray-500 outline-none w-full"
            />
          </div>
        </div>

        {/* Regels */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Producten / Diensten
            </p>
            <button
              onClick={addItem}
              className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
            >
              + Regel toevoegen
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
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-full"
              />
              <input
                type="number"
                placeholder="Aantal"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-20 text-center"
              />
              <input
                type="number"
                placeholder="Prijs"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value))
                }
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white w-24 text-right"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-3 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- RECHTER KOLOM: PREVIEW & ACTIE --- */}
      <div className="flex flex-col h-full space-y-6">
        {/* Live Preview Card */}
        <div className="bg-white text-black rounded-3xl shadow-2xl p-8 flex-1 min-h-[500px] relative overflow-hidden font-mono text-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">FACTUUR</h2>
              <p className="text-gray-500">#{data.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{data.ownName || "Jouw Bedrijf"}</p>
              <p className="text-gray-600">{data.ownAddress}</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-xs uppercase mb-1">
              Factureren aan:
            </p>
            <p className="font-bold">{data.clientName || "Klant Naam"}</p>
            <p>{data.clientAddress}</p>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-2">Omschrijving</th>
                <th className="pb-2 text-center">Aantal</th>
                <th className="pb-2 text-right">Prijs</th>
                <th className="pb-2 text-right">Totaal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">
                    {item.description || "Nieuw product"}
                  </td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">€ {item.price.toFixed(2)}</td>
                  <td className="py-2 text-right font-medium">
                    € {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-black pt-4 flex justify-end">
            <div className="text-right w-48">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotaal</span>
                <span>€ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">BTW (21%)</span>
                <span>€ {vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Totaal</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button (Updated with Loader) */}
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-gray-600 to-indigo-600 hover:from-gray-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-gray-900/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
