/**
 * Converteert scan resultaten naar CSV formaat (NL standaard: puntkomma gescheiden)
 */
export function convertToCSV(data: any[]): string {
    // 1. Definieer kolommen
    const columns = [
        { key: 'supplier_name', label: 'Leverancier' },
        { key: 'supplier_kvk', label: 'KvK' },
        { key: 'supplier_vat_id', label: 'BTW Nummer' },
        { key: 'supplier_iban', label: 'IBAN' },
        { key: 'invoice_number', label: 'Factuurnummer' },
        { key: 'invoice_date', label: 'Factuurdatum' },
        { key: 'due_date', label: 'Vervaldatum' },
        { key: 'subtotal', label: 'Bedrag Excl' },
        { key: 'vat_percentage', label: 'BTW %' },
        { key: 'vat_amount', label: 'BTW Bedrag' },
        { key: 'total_amount', label: 'Totaalbedrag' },
        { key: 'currency', label: 'Valuta' },
        { key: 'payment_reference', label: 'Betalingskenmerk' }
    ];

    // 2. Header rij
    const header = columns.map(c => c.label).join(';');

    // 3. Data rijen
    const rows = data.map(item => {
        // Haal geneste data op uit het resultaat object
        // Structuur: item.result.supplier.name, item.result.totals.subtotal, etc.
        const r = item.result || {}; // Fallback als resultaat leeg is
        const s = r.supplier || {};
        const i = r.invoice || {};
        const t = r.totals || {};
        const m = r.metadata || {};

        const values = [
            escapeCsv(s.name),
            escapeCsv(s.kvk_number),
            escapeCsv(s.vat_id),
            escapeCsv(s.iban),
            escapeCsv(i.number),
            escapeCsv(i.date),
            escapeCsv(i.due_date),
            formatNumber(t.subtotal),
            formatNumber(t.vat_percentage),
            formatNumber(t.vat_amount),
            formatNumber(t.total_amount),
            escapeCsv(t.currency),
            escapeCsv(m.payment_terms || i.reference)
        ];

        return values.join(';');
    });

    return [header, ...rows].join('\n');
}

// Helper: Escape waarden voor CSV (quotes om tekst als er ; in zit, etc.)
function escapeCsv(value: any): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Helper: Format nummer voor CSV (NL standaard: komma als decimaal, punt als duizendtal?)
// Voor software is . vaak veiliger, maar Excel NL wil ,
// We houden het voor nu op de standaard JS output (punt) voor maximale software compatibiliteit,
// tenzij user expliciet komma wil. Veel import tools snappen . prima.
function formatNumber(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value.toFixed(2);
    return String(value);
}
