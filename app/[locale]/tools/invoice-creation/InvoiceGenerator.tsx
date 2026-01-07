"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Download,
    PenTool,
    Loader2,
    RefreshCw,
    Image as ImageIcon,
    Settings,
    FileText,
    Receipt,
    Building2,
    User,
    Calendar,
    Hash,
    CreditCard,
    Percent,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Sparkles,
    Check,
    Save,
    History,
    BookTemplate,
    Users,
    Search,
    X,
    Copy,
    Mail
} from "lucide-react";
import { useResultHistory } from "@/hooks/useResultHistory";
import { ResultHistory } from "@/app/Components/tools/ResultHistory";
import { ToolActionBar } from "@/app/Components/tools/ToolActionBar";
import TemplateSelector from "@/app/Components/tools/TemplateSelector";

// --- TYPES ---
type InvoiceItem = {
    id: string;
    description: string;
    quantity: number;
    price: number;
    vatRate: number;
};

type InvoiceData = {
    ownName: string;
    ownAddress: string;
    ownKvk: string;
    ownBtw: string;
    ownIban: string;
    ownEmail: string;
    ownPhone: string;
    ownLogo: string | null;
    clientName: string;
    clientAddress: string;
    clientEmail: string;
    invoiceNumber: string;
    invoiceDate: string;
    expiryDate: string;
    discountPercentage: number;
    notes: string;
    paymentTerms: string;
};

type SavedClient = {
    id: string;
    name: string;
    address: string;
    email: string;
    lastUsed: string;
};

// --- HELPER: CURRENCY ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
};

// Generate invoice number
const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${year}-${random}`;
};

export default function InvoiceGenerator() {
    // --- STATE ---
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "settings" | "notes">("content");
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showItemsExpanded, setShowItemsExpanded] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showClientSearch, setShowClientSearch] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const [savedClients, setSavedClients] = useState<SavedClient[]>([]);
    const [isSaved, setIsSaved] = useState(false);

    // History
    const {
        history,
        saveToHistory,
        loadEntry,
        deleteEntry,
        clearHistory,
        toggleStar,
        exportHistory,
        importHistory
    } = useResultHistory<any>("invoice-creation");

    // Initial Defaults
    const defaultData: InvoiceData = {
        ownName: "",
        ownAddress: "",
        ownKvk: "",
        ownBtw: "",
        ownIban: "",
        ownEmail: "",
        ownPhone: "",
        ownLogo: null,
        clientName: "",
        clientAddress: "",
        clientEmail: "",
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        discountPercentage: 0,
        notes: "Wij verzoeken u vriendelijk het bovenstaande bedrag te voldoen voor de vervaldatum.",
        paymentTerms: "14 dagen",
    };

    const defaultItems: InvoiceItem[] = [
        { id: "1", description: "Consultancy uren", quantity: 8, price: 85, vatRate: 21 },
    ];

    const [data, setData] = useState<InvoiceData>(defaultData);
    const [items, setItems] = useState<InvoiceItem[]>(defaultItems);

    // --- LOCAL STORAGE ---
    useEffect(() => {
        const savedData = localStorage.getItem("invoice_data");
        const savedItems = localStorage.getItem("invoice_items");
        const savedClientsData = localStorage.getItem("invoice_clients");

        if (savedData) setData(JSON.parse(savedData));
        if (savedItems) setItems(JSON.parse(savedItems));
        if (savedClientsData) setSavedClients(JSON.parse(savedClientsData));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("invoice_data", JSON.stringify(data));
            localStorage.setItem("invoice_items", JSON.stringify(items));
        }
    }, [data, items, isLoaded]);

    // Save clients
    useEffect(() => {
        if (savedClients.length > 0) {
            localStorage.setItem("invoice_clients", JSON.stringify(savedClients));
        }
    }, [savedClients]);

    // --- ACTIONS ---
    const handleDataChange = (field: keyof InvoiceData, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
        setIsSaved(false);
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
        setIsSaved(false);
    };

    const addItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), description: "", quantity: 1, price: 0, vatRate: 21 },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const duplicateItem = (index: number) => {
        const itemToCopy = { ...items[index], id: Date.now().toString() };
        const newItems = [...items];
        newItems.splice(index + 1, 0, itemToCopy);
        setItems(newItems);
    };

    const resetForm = () => {
        if (confirm("Weet je zeker dat je alle gegevens wilt wissen?")) {
            setData({ ...defaultData, invoiceNumber: generateInvoiceNumber() });
            setItems(defaultItems);
            localStorage.removeItem("invoice_data");
            localStorage.removeItem("invoice_items");
        }
    };

    // Client management
    const saveClient = () => {
        if (!data.clientName) return;

        const existingIndex = savedClients.findIndex(c => c.name === data.clientName);
        const newClient: SavedClient = {
            id: existingIndex >= 0 ? savedClients[existingIndex].id : Date.now().toString(),
            name: data.clientName,
            address: data.clientAddress,
            email: data.clientEmail,
            lastUsed: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            const updated = [...savedClients];
            updated[existingIndex] = newClient;
            setSavedClients(updated);
        } else {
            setSavedClients([newClient, ...savedClients].slice(0, 50));
        }
    };

    const selectClient = (client: SavedClient) => {
        setData(prev => ({
            ...prev,
            clientName: client.name,
            clientAddress: client.address,
            clientEmail: client.email,
        }));
        setShowClientSearch(false);
        setClientSearchQuery("");
    };

    const deleteClient = (clientId: string) => {
        setSavedClients(savedClients.filter(c => c.id !== clientId));
    };

    const filteredClients = savedClients.filter(c =>
        c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
    );

    // Template management - handle when a template is selected
    const handleSelectTemplate = (templateData: any) => {
        // Template data contains partial data, merge with existing
        if (templateData.data) setData(prev => ({ ...prev, ...templateData.data }));
        if (templateData.items) setItems(templateData.items);
        setShowTemplates(false);
    };

    // History management
    const handleSaveToHistory = () => {
        saveToHistory(
            {
                invoiceNumber: data.invoiceNumber,
                clientName: data.clientName || 'Geen klant'
            },
            { data, items, total },
            ['invoice', data.clientName || 'Draft']
        );
        setIsSaved(true);
    };

    const handleLoadHistory = useCallback((entry: any) => {
        const historyData = entry.result;
        setData(historyData.data);
        setItems(historyData.items);
        setShowHistory(false);
    }, []);

    // --- CALCULATIONS ---
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const discountAmount = subtotal * (data.discountPercentage / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;

    const vatBreakdown = items.reduce((acc, item) => {
        const lineTotal = item.quantity * item.price;
        const lineTotalDiscounted = lineTotal * (1 - data.discountPercentage / 100);
        const vatAmount = lineTotalDiscounted * (item.vatRate / 100);
        acc[item.vatRate] = (acc[item.vatRate] || 0) + vatAmount;
        return acc;
    }, {} as Record<number, number>);

    const totalVat = Object.values(vatBreakdown).reduce((acc, val) => acc + val, 0);
    const total = subtotalAfterDiscount + totalVat;

    // --- PDF GENERATION ---
    const generatePDF = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        // Auto-save client
        if (data.clientName) {
            saveClient();
        }

        try {
            const payload = {
                ...data,
                items,
            };

            const response = await fetch("/api/v1/finance/create-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Generatie mislukt");
            }

            // Save to history
            handleSaveToHistory();

            // Create blob URL for PDF
            const pdfBlob = new Blob(
                [Uint8Array.from(atob(result.data.pdfBase64), (c) => c.charCodeAt(0))],
                { type: "application/pdf" }
            );

            const link = document.createElement("a");
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `Factuur_${data.invoiceNumber || "concept"}.pdf`;
            link.click();

            // Increment invoice number for next invoice
            const match = data.invoiceNumber.match(/^(.+?)(\d+)$/);
            if (match) {
                const prefix = match[1];
                const num = parseInt(match[2], 10) + 1;
                const newNumber = `${prefix}${num.toString().padStart(match[2].length, '0')}`;
                handleDataChange("invoiceNumber", newNumber);
            }

        } catch (e: any) {
            console.error(e);
            alert(e.message || "Fout bij genereren PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isLoaded) return null;

    // --- TAB CONFIG ---
    const tabs = [
        { id: "content" as const, label: "Inhoud", icon: PenTool },
        { id: "settings" as const, label: "Gegevens", icon: Settings },
        { id: "notes" as const, label: "Notities", icon: FileText },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header Actions */}
            {/* Action Bar */}
            <div className="mb-6">
                <ToolActionBar
                    copyText={`Factuur ${data.invoiceNumber}\nClient: ${data.clientName}\nTotaal: ${formatCurrency(total)}`}
                    onSaveToHistory={handleSaveToHistory}
                    onReset={resetForm}
                    isSaved={isSaved}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                    showTemplates={showTemplates}
                    setShowTemplates={setShowTemplates}
                />
            </div>

            {/* History Panel */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <ResultHistory
                            history={history}
                            onLoadEntry={handleLoadHistory}
                            onDeleteEntry={deleteEntry}
                            onClearHistory={clearHistory}
                            onToggleStar={toggleStar}
                            onExportHistory={exportHistory}
                            onImportHistory={importHistory}
                            renderPreview={(item: any) => (
                                <div className="text-sm">
                                    <span className="text-white font-medium">{item.data?.clientName || 'Geen klant'}</span>
                                    <span className="mx-2 text-zinc-600">•</span>
                                    <span className="text-emerald-400">{formatCurrency(item.total || 0)}</span>
                                </div>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Templates Panel */}
            <AnimatePresence>
                {showTemplates && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <TemplateSelector
                            toolId="invoice-creation"
                            currentData={{ data, items }}
                            onSelectTemplate={handleSelectTemplate}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Preview Toggle */}
            <div className="xl:hidden mb-4">
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-colors"
                >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? "Toon Editor" : "Bekijk Preview"}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* === LEFT: EDITOR === */}
                <div className={`flex flex-col gap-4 ${showPreview ? "hidden xl:flex" : "flex"}`}>
                    {/* Tab Navigation */}
                    <div className="bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 flex gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-emerald-500 text-white shadow-md"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Editor Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-5 sm:p-6 min-h-[500px]">
                        {/* TAB: CONTENT */}
                        {activeTab === "content" && (
                            <div className="space-y-6">
                                {/* Client Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-white">Klantgegevens</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowClientSearch(!showClientSearch)}
                                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
                                        >
                                            <Users className="w-3.5 h-3.5" />
                                            Klanten ({savedClients.length})
                                        </button>
                                    </div>

                                    {/* Client Search */}
                                    <AnimatePresence>
                                        {showClientSearch && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-zinc-800 rounded-xl p-4 space-y-3"
                                            >
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Zoek klant..."
                                                        value={clientSearchQuery}
                                                        onChange={(e) => setClientSearchQuery(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="max-h-40 overflow-y-auto space-y-1">
                                                    {filteredClients.length === 0 ? (
                                                        <p className="text-xs text-zinc-500 py-2 text-center">Geen klanten gevonden</p>
                                                    ) : (
                                                        filteredClients.map(client => (
                                                            <div
                                                                key={client.id}
                                                                className="flex items-center justify-between p-2 hover:bg-zinc-700 rounded-lg cursor-pointer group"
                                                                onClick={() => selectClient(client)}
                                                            >
                                                                <div>
                                                                    <p className="text-sm text-white">{client.name}</p>
                                                                    <p className="text-xs text-zinc-400">{client.email}</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-zinc-400 hover:text-red-400 transition-all"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <input
                                        type="text"
                                        placeholder="Bedrijfsnaam klant"
                                        value={data.clientName}
                                        onChange={(e) => handleDataChange("clientName", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                    <textarea
                                        placeholder="Adres klant"
                                        value={data.clientAddress}
                                        onChange={(e) => handleDataChange("clientAddress", e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                    />
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            placeholder="Email klant"
                                            value={data.clientEmail}
                                            onChange={(e) => handleDataChange("clientEmail", e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Invoice Details */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <Receipt className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">Factuurdetails</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Factuurnummer</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    value={data.invoiceNumber}
                                                    onChange={(e) => handleDataChange("invoiceNumber", e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Datum</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="date"
                                                    value={data.invoiceDate}
                                                    onChange={(e) => handleDataChange("invoiceDate", e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Vervaldatum</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="date"
                                                    value={data.expiryDate}
                                                    onChange={(e) => handleDataChange("expiryDate", e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Line Items */}
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setShowItemsExpanded(!showItemsExpanded)}
                                        className="w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-white">Factuurregels ({items.length})</h3>
                                        </div>
                                        {showItemsExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-zinc-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                                        )}
                                    </button>

                                    {showItemsExpanded && (
                                        <div className="space-y-3">
                                            {items.map((item, index) => (
                                                <div key={item.id} className="group bg-zinc-800 rounded-xl p-3 border border-zinc-700 hover:border-zinc-600 transition-colors">
                                                    <div className="flex flex-col gap-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Omschrijving"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, "description", e.target.value)}
                                                            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                        />
                                                        <div className="grid grid-cols-12 gap-2">
                                                            <div className="col-span-3">
                                                                <input
                                                                    type="number"
                                                                    placeholder="#"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                                                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                                />
                                                            </div>
                                                            <div className="col-span-4 relative">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">€</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    value={item.price}
                                                                    onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                                                                    className="w-full pl-6 pr-2 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                                />
                                                            </div>
                                                            <div className="col-span-3">
                                                                <select
                                                                    value={item.vatRate}
                                                                    onChange={(e) => updateItem(index, "vatRate", Number(e.target.value))}
                                                                    className="w-full px-1 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                                >
                                                                    <option value={21}>21%</option>
                                                                    <option value={9}>9%</option>
                                                                    <option value={0}>0%</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-span-2 flex justify-end gap-1">
                                                                <button
                                                                    onClick={() => duplicateItem(index)}
                                                                    className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                    title="Dupliceer"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => removeItem(index)}
                                                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end mt-2">
                                                        <span className="text-sm font-medium text-zinc-300">
                                                            {formatCurrency(item.quantity * item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={addItem}
                                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 rounded-xl text-sm font-medium text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Regel toevoegen
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Discount */}
                                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-zinc-400" />
                                        <span className="text-sm font-medium text-zinc-300">Korting</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.discountPercentage}
                                            onChange={(e) => handleDataChange("discountPercentage", Number(e.target.value))}
                                            className="w-20 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-sm text-right text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        <span className="text-sm text-zinc-400">%</span>
                                    </div>
                                </div>

                                {/* Totals Summary (Mobile) */}
                                <div className="xl:hidden bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-emerald-400">Totaal incl. BTW</span>
                                        <span className="text-xl font-bold text-emerald-400">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SETTINGS */}
                        {activeTab === "settings" && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Jouw bedrijfsgegevens</h3>
                                </div>

                                {/* Logo Upload */}
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden relative group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer">
                                        {data.ownLogo ? (
                                            <img src={data.ownLogo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Bedrijfslogo</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">JPG of PNG, max 2MB</p>
                                        {data.ownLogo && (
                                            <button
                                                onClick={() => handleDataChange("ownLogo", null)}
                                                className="text-xs text-red-400 mt-2 hover:underline"
                                            >
                                                Verwijder logo
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Jouw bedrijfsnaam"
                                        value={data.ownName}
                                        onChange={(e) => handleDataChange("ownName", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Straat + Nr, Postcode Stad"
                                        value={data.ownAddress}
                                        onChange={(e) => handleDataChange("ownAddress", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="KvK Nummer"
                                                value={data.ownKvk}
                                                onChange={(e) => handleDataChange("ownKvk", e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="BTW Nummer"
                                                value={data.ownBtw}
                                                onChange={(e) => handleDataChange("ownBtw", e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            placeholder="IBAN"
                                            value={data.ownIban}
                                            onChange={(e) => handleDataChange("ownIban", e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={data.ownEmail}
                                            onChange={(e) => handleDataChange("ownEmail", e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Telefoon"
                                            value={data.ownPhone}
                                            onChange={(e) => handleDataChange("ownPhone", e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-800">
                                    <button
                                        onClick={resetForm}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reset alle gegevens
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB: NOTES */}
                        {activeTab === "notes" && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-rose-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Voettekst & voorwaarden</h3>
                                </div>

                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Betalingstermijn</label>
                                    <select
                                        value={data.paymentTerms}
                                        onChange={(e) => handleDataChange("paymentTerms", e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    >
                                        <option value="direct">Direct</option>
                                        <option value="7 dagen">7 dagen</option>
                                        <option value="14 dagen">14 dagen</option>
                                        <option value="30 dagen">30 dagen</option>
                                        <option value="45 dagen">45 dagen</option>
                                        <option value="60 dagen">60 dagen</option>
                                    </select>
                                </div>

                                <textarea
                                    value={data.notes}
                                    onChange={(e) => handleDataChange("notes", e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                                    placeholder="Bijv: Gelieve te betalen binnen 14 dagen..."
                                />
                                <p className="text-xs text-zinc-500">
                                    Deze tekst verschijnt onderaan de factuur.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Generate Button (Mobile) */}
                    <div className="xl:hidden">
                        <button
                            onClick={generatePDF}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Genereren...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* === RIGHT: PREVIEW === */}
                <div className={`flex flex-col gap-4 ${showPreview ? "flex" : "hidden xl:flex"}`}>
                    {/* A4 Preview */}
                    <div className="bg-white rounded-sm shadow-2xl p-6 sm:p-8 lg:p-10 min-h-[600px] flex flex-col text-zinc-900">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                {data.ownLogo ? (
                                    <img src={data.ownLogo} alt="Logo" className="h-12 sm:h-14 object-contain mb-3" />
                                ) : (
                                    <div className="h-12 w-24 bg-zinc-100 rounded-lg flex items-center justify-center mb-3">
                                        <span className="text-xs text-zinc-400 font-medium">LOGO</span>
                                    </div>
                                )}
                                <p className="font-bold text-zinc-900">{data.ownName || "Jouw Bedrijf"}</p>
                                <p className="text-zinc-500 text-xs mt-1">{data.ownAddress}</p>
                                <div className="text-zinc-400 text-xs mt-2 space-y-0.5">
                                    {data.ownKvk && <p>KvK: {data.ownKvk}</p>}
                                    {data.ownBtw && <p>BTW: {data.ownBtw}</p>}
                                    {data.ownIban && <p>IBAN: {data.ownIban}</p>}
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight mb-1">FACTUUR</h1>
                                <p className="text-zinc-500 text-sm">#{data.invoiceNumber}</p>
                                <p className="text-zinc-400 text-xs mt-1">{data.invoiceDate}</p>
                            </div>
                        </div>

                        {/* Client */}
                        <div className="mb-8 pb-6 border-b border-zinc-100">
                            <p className="text-xs text-zinc-400 uppercase font-semibold tracking-wider mb-1">Factureren aan</p>
                            <p className="font-semibold text-zinc-900">{data.clientName || "Naam Klant"}</p>
                            <p className="text-zinc-600 text-sm whitespace-pre-wrap">{data.clientAddress || "Adres Klant"}</p>
                            {data.clientEmail && <p className="text-zinc-400 text-xs mt-1">{data.clientEmail}</p>}
                        </div>

                        {/* Table */}
                        <div className="flex-1">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-emerald-500 text-white">
                                        <th className="py-2.5 px-3 text-left font-semibold text-xs rounded-l-lg">Omschrijving</th>
                                        <th className="py-2.5 px-3 text-center font-semibold text-xs w-16">Aantal</th>
                                        <th className="py-2.5 px-3 text-right font-semibold text-xs w-20">Prijs</th>
                                        <th className="py-2.5 px-3 text-right font-semibold text-xs w-20 rounded-r-lg">Totaal</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-700">
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-zinc-100 last:border-0">
                                            <td className="py-3 px-3">{item.description || "..."}</td>
                                            <td className="py-3 px-3 text-center">{item.quantity}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(item.price)}</td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-8 flex justify-end">
                            <div className="w-56 space-y-2">
                                <div className="flex justify-between text-zinc-500 text-sm">
                                    <span>Subtotaal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {data.discountPercentage > 0 && (
                                    <div className="flex justify-between text-red-500 text-sm">
                                        <span>Korting ({data.discountPercentage}%)</span>
                                        <span>- {formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                {Object.entries(vatBreakdown).map(([rate, amount]) =>
                                    amount > 0 && (
                                        <div key={rate} className="flex justify-between text-zinc-500 text-sm">
                                            <span>BTW ({rate}%)</span>
                                            <span>{formatCurrency(amount)}</span>
                                        </div>
                                    )
                                )}
                                <div className="flex justify-between text-lg font-bold text-emerald-600 pt-3 border-t border-zinc-200 mt-2">
                                    <span>Totaal</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-10 pt-6 border-t border-zinc-100 text-center">
                            <p className="text-xs text-zinc-400">{data.notes}</p>
                            <p className="text-xs text-zinc-300 mt-2">Betalingstermijn: {data.paymentTerms}</p>
                        </div>
                    </div>

                    {/* Generate Button (Desktop) */}
                    <button
                        onClick={generatePDF}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Bezig met genereren...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Download PDF Factuur
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
