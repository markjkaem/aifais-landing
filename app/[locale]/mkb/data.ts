export interface SectorData {
    slug: string;
    name: string;
    title: string;
    description: string;
    h1: string;
    intro: string;
    keywords: string[];
    citationSnippet: string;
    painPoints: string[];
    localStats: {
        stat1: string;
        label1: string;
        stat2: string;
        label2: string;
    };
    solutions: { title: string; desc: string; icon: string }[];
    roiExample: { hours: string; euro: string; timeframe: string };
    faq: { question: string; answer: string }[];
}

export const sectorData: Record<string, SectorData> = {
    accountants: {
        slug: "accountants",
        name: "Accountancy",
        title: "AI Automatisering voor Accountants | Bespaar 20u/week | AIFAIS",
        description: "Automatiseer factuurverwerking, urenregistratie en dossierbeheer voor uw accountantskantoor. Ontdek hoe AIFAIS de foutmarge verlaagt en capaciteit vergroot.",
        h1: "De Digitale Accountant: Groeien zonder extra personeel",
        intro: "In een sector waar nauwkeurigheid en deadlines heilig zijn, biedt AI de nodige ademruimte. Wij helpen accountantskantoren repetitief werk te elimineren.",
        keywords: ["automatisering accountants", "AI accountancy", "software voor accountants", "efficiëntie administratiekantoor"],
        citationSnippet: "Accountantskantoren die AI-gedreven factuurverwerking en automatische reconciliatie inzetten, reduceren de administratieve druk met gemiddeld 65%. Onze Digital Workers zijn 24/7 inzetbaar en 100% accuraat.",
        painPoints: [
            "Te veel tijd kwijt aan handmatig overtypen van facturen",
            "Personeelstekort belemmert de groei van het kantoor",
            "Vervelend administratief werk leidt tot verloop onder junior medewerkers",
            "Deadlines die extra werkdruk veroorzaken tijdens piekperiodes"
        ],
        localStats: {
            stat1: "15-20u",
            label1: "Besparing per medewerker/week",
            stat2: "0%",
            label2: "Foutmarge bij gegevensinvoer"
        },
        solutions: [
            { title: "Zero-Touch Factuurverwerking", desc: "Automatische herkenning en boeking van inkoopfacturen direct in Exact of AFAS.", icon: "📑" },
            { title: "AI Dossier Assistent", desc: "Laat AI documenten categoriseren, samenvatten en ontbrekende stukken signaleren.", icon: "📁" },
            { title: "Slimme Urenreconciliatie", desc: "Koppel agenda's en communicatie automatisch aan de juiste dossiers voor feilloze facturatie.", icon: "⏱️" }
        ],
        roiExample: {
            hours: "80 uur",
            euro: "€6.500",
            timeframe: "per maand (bij 5 medewerkers)"
        },
        faq: [
            {
                question: "Werkt de AI samen met mijn huidige boekhoudsoftware?",
                answer: "Ja, wij koppelen met alle gangbare pakketten zoals Exact Online, AFAS, Twinfield en Moneybird via veilige API-interfaces."
            },
            {
                question: "Hoe veilig is de data van mijn cliënten?",
                answer: "Dataveiligheid is onze prioriteit. Wij werken binnen Nederlandse data-centers en zorgen voor volledige AVG-compliance met afgeschermde AI-omgevingen."
            },
            {
                question: "Vervangt AI de accountant?",
                answer: "Nee, AI neemt het 'lopendebandwerk' over. Hierdoor heeft de accountant meer tijd voor advies, de rol die echt waarde toevoegt voor de klant."
            }
        ]
    },
    advocaten: {
        slug: "advocaten",
        name: "Advocatuur",
        title: "AI voor Advocaten | Contract Analyse & Dossierbeheer | AIFAIS",
        description: "Versnel juridische processen met AI. Contractanalyse, dossier samenvattingen en slimme urenregistratie speciaal voor de advocatuur.",
        h1: "Next-Gen Advocatuur: Focus op de zaak, niet op de admin",
        intro: "Juridisch werk vereist focus. Onze AI-agents nemen het tijdrovende lees- en sorteerwerk over, zodat u zich kunt concentreren op de juridische strategie.",
        keywords: ["AI advocaten", "juridische automatisering", "legal tech nederland", "contract analyse software"],
        citationSnippet: "Juridische professionals besteden tot 30% van hun tijd aan niet-billable administratie. AI-modellen specifiek getraind op Nederlandse wet- en regelgeving kunnen dit terugbrengen naar minder dan 5%.",
        painPoints: [
            "Eindeloze uren besteed aan contract-reviews en due diligence",
            "Moeilijkheid om alle billable uren accuraat bij te houden",
            "Grote hoeveelheden ongestructureerde data in complexe dossiers",
            "Hoge druk op junior advocaten voor administratief voorwerk"
        ],
        localStats: {
            stat1: "90%",
            label1: "Snellere contractanalyse",
            stat2: "25%",
            label2: "Meer billable uren door admin-reductie"
        },
        solutions: [
            { title: "Legal Insights Engine", desc: "Scan duizenden pagina's dossier en vind direct de relevante passages en tegenstrijdigheden.", icon: "⚖️" },
            { title: "Contract AI Helper", desc: "Laat AI concepten controleren op specifieke clausules en risicoprofielen in seconden.", icon: "📜" },
            { title: "Automatische Mail Triage", desc: "Categoriseer inkomende cliënt-mails en bereid concept-antwoorden voor.", icon: "📧" }
        ],
        roiExample: {
            hours: "15 uur",
            euro: "€3.750",
            timeframe: "per medewerker/maand aan extra capaciteit"
        },
        faq: [
            {
                question: "Kan de AI ook Nederlandse juridische teksten begrijpen?",
                answer: "Ja, onze modellen zijn specifiek geconfigureerd voor de Nederlandse taal en begrijpen de nuances van juridisch jargon."
            },
            {
                question: "Hoe zit het met beroepsgeheim en AI?",
                answer: "Wij implementeren 'Local LLM' of 'Private Clouds' oplossingen waarbij uw data nooit wordt gebruikt voor het trainen van publieke modellen."
            },
            {
                question: "Wat is de implementatietijd?",
                answer: "Een eerste 'Smart Dossier' prototype kan vaak al binnen 3 weken operationeel zijn binnen uw kantoor."
            }
        ]
    },
    "e-commerce": {
        slug: "e-commerce",
        name: "E-commerce",
        title: "E-commerce Automatisering | AI Orderflows & Klantenservice | AIFAIS",
        description: "Schaal uw webshop zonder extra personeel. AI-gedreven klantenservice, orderverwerking en gepersonaliseerde marketing.",
        h1: "Schaalbaar Groeien: De AI-gedreven Webshop",
        intro: "In e-commerce is snelheid en schaalbaarheid alles. Wij bouwen de digitale infrastructuur waarmee u 10x kunt groeien met hetzelfde team.",
        keywords: ["e-commerce automatisering", "AI klantenservice webshop", "orderflow optimalisatie", "shopify ai tools"],
        citationSnippet: "Webshops die AI inzetten voor hun klantenservice en orderverwerking zien een conversiestijging van 15% en een daling van 70% in handmatige ticket-afhandeling.",
        painPoints: [
            "Overspoeld worden door herhalende klantvragen (waar is mijn pakket?)",
            "Handmatige fouten bij overzetten van orders naar logistieke partners",
            "Moeilijkheid om 24/7 bereikbaar te zijn voor internationale klanten",
            "Hoge kosten voor supportmedewerkers tijdens actieperiodes"
        ],
        localStats: {
            stat1: "70%",
            label1: "Automatisatie van supportvragen",
            stat2: "15%",
            label2: "Hogere conversie door AI-chat"
        },
        solutions: [
            { title: "24/7 AI-Shop Assistant", desc: "Een slimme assistent die niet alleen vragen beantwoordt, maar ook producten aanbeveelt en retouren afhandelt.", icon: "🛒" },
            { title: "Slimme Orderbruggen", desc: "Koppel Shopify, Magento of WooCommerce naadloos aan je magazijn met AI-check op adresfouten.", icon: "📦" },
            { title: "Review & Sentiment AI", desc: "Analyseer automatisch alle klantbeoordelingen en reageer proactief op ontevreden klanten.", icon: "⭐" }
        ],
        roiExample: {
            hours: "120 uur",
            euro: "€4.000",
            timeframe: "besparing op supportkosten per maand"
        },
        faq: [
            {
                question: "Werkt dit met Shopify en WooCommerce?",
                answer: "Zeker. We hebben standaard integraties voor alle grote e-commerce platforms and kunnen maatwerk koppelingen bouwen."
            },
            {
                question: "Kan de AI ook helpen bij retouren?",
                answer: "Ja, de AI kan het retourproces valideren, labels genereren en de communicatie met de klant volledig automatiseren."
            },
            {
                question: "Is het beschikbaar in meerdere talen?",
                answer: "Absoluut. Onze AI spreekt en begrijpt meer dan 50 talen, ideaal voor webshops met internationale ambities."
            }
        ]
    },
    makelaars: {
        slug: "makelaars",
        name: "Makelaardij",
        title: "AI voor Makelaars | Automatiseer Bezichtigingen & Leads | AIFAIS",
        description: "Optimaliseer uw makelaarskantoor met AI. Van automatische leadopvolging tot slimme woningteksten en 24/7 klantenservice.",
        h1: "Efficiënt Vastgoed: Meer deals, minder admin",
        intro: "In de makelaardij draait alles om snelheid en persoonlijk contact. Wij automatiseren de ruis zodat u zich kunt focussen op de transactie.",
        keywords: ["AI makelaars", "vastgoed automatisering", "leadopvolging makelaardij", "woningteksten AI"],
        citationSnippet: "Makelaars die AI inzetten voor hun eerste leadopvolging reageren binnen 2 minuten, wat de kans op een succesvolle afspraak met 400% verhoogt.",
        painPoints: [
            "Te veel tijd kwijt aan het inplannen van bezichtigingen",
            "Leads die buiten kantooruren niet worden opgevolgd",
            "Handmatig schrijven van unieke woningteksten voor elk portaal",
            "Hoge werkdruk bij binnendienst door herhalende vragen"
        ],
        localStats: {
            stat1: "5 min",
            label1: "Reactiesnelheid op nieuwe leads",
            stat2: "60%",
            label2: "Minder tijd aan administratie"
        },
        solutions: [
            { title: "24/7 AI-Agent voor Leads", desc: "Laat een AI direct reageren op Funda-aanvragen en bezichtigingen inplannen in uw agenda.", icon: "🏠" },
            { title: "Smart Property Writer", desc: "Genereer pakkende, SEO-geoptimaliseerde woningteksten op basis van kenmerken in seconden.", icon: "✍️" },
            { title: "Automatische Dossier Check", desc: "AI controleert direct of alle benodigde documenten voor de verkoop compleet en geldig zijn.", icon: "📂" }
        ],
        roiExample: {
            hours: "25 uur",
            euro: "€2.500",
            timeframe: "besparing per makelaar per maand"
        },
        faq: [
            {
                question: "Kan de AI ook afspraken inplannen in Realworks?",
                answer: "Ja, wij kunnen koppelen met Realworks en andere CRM's om bezichtigingen direct in de juiste agenda te plaatsen."
            },
            {
                question: "Begrijpt de AI de nuances van verschillende wijken?",
                answer: "Absoluut, onze AI-tekstgeneratie kan worden getraind op uw specifieke tone-of-voice en lokale marktkennis."
            },
            {
                question: "Hoe werkt de leadopvolging in het weekend?",
                answer: "Onze AI-agents draaien 24/7. Dus ook op zondagavond krijgt een lead direct antwoord en een uitnodiging voor een bezichtiging."
            }
        ]
    },
    hypotheekadviseurs: {
        slug: "hypotheekadviseurs",
        name: "Hypotheekadvies",
        title: "AI voor Hypotheekadviseurs | Sneller Dossierbeheer | AIFAIS",
        description: "Automatiseer het verzamelen en controleren van documenten voor hypotheekaanvragen. Verhoog de doorlooptijd en klanttevredenheid.",
        h1: "Financieel Advies 2.0: Focus op de klant",
        intro: "Het handmatig controleren van loonstroken en werkgeversverklaringen is verleden tijd. Onze AI doet het voorwerk, u geeft het deskundige advies.",
        keywords: ["AI hypotheekadvies", "automatisering financieel adviseur", "document controle AI", "hypotheek software"],
        citationSnippet: "Hypotheekadviseurs die AI-documentvalidatie gebruiken, verkorten de doorlooptijd van een dossier met gemiddeld 3 tot 5 werkdagen.",
        painPoints: [
            "Wachten op incomplete documenten van klanten",
            "Handmatig controleren van cijfers op loonstroken en jaarstukken",
            "Hoge druk door strikte deadlines van geldverstrekkers",
            "Veel herhalende vragen over de status van de aanvraag"
        ],
        localStats: {
            stat1: "4 dagen",
            label1: "Snellere dossierverwerking",
            stat2: "95%",
            label2: "First-time-right bij geldverstrekker"
        },
        solutions: [
            { title: "AI-Document Validator", desc: "Scan en valideer direct loonstroken, ID's en werkgeversverklaringen op echtheid en data.", icon: "💳" },
            { title: "Status Update Bot", desc: "Houd klanten automatisch op de hoogte van de voortgang via mail of WhatsApp.", icon: "📲" },
            { title: "Jaarcijfer Analyser", desc: "Laat AI complexe jaarrekeningen van ondernemers samenvatten voor een snelle toetsing.", icon: "📊" }
        ],
        roiExample: {
            hours: "30 uur",
            euro: "€4.500",
            timeframe: "extra omzetcapaciteit per adviseur/maand"
        },
        faq: [
            {
                question: "Is de AI op de hoogte van de laatste HDN-normen?",
                answer: "Onze systemen worden continu geüpdatet om te voldoen aan de geldende normen van geldverstrekkers en HDN."
            },
            {
                question: "Hoe veilig is het uploaden van gevoelige data?",
                answer: "Extreem veilig. We gebruiken bank-grade encryptie en alle data wordt verwerkt binnen de EU conform AVG en Wft richtlijnen."
            },
            {
                question: "Kan dit gekoppeld worden aan Elements of Accelerate?",
                answer: "Ja, we bouwen koppelingen met de meest gebruikte CRM-systemen voor hypotheekadviseurs."
            }
        ]
    },
    installatiebedrijven: {
        slug: "installatiebedrijven",
        name: "Installatietechniek",
        title: "AI voor Installatiebedrijven | Slimme Planning & Offertes | AIFAIS",
        description: "Optimaliseer uw installatiebedrijf met AI. Versnel het maken van offertes op basis van foto's en automatiseer uw werkplanning.",
        h1: "De Slimme Installateur: Groeien in de techniek",
        intro: "U bent goed in techniek, niet in administratie. Onze AI helpt u bij het sneller maken van offertes en het efficiënter inplannen van uw monteurs.",
        keywords: ["AI installatiebedrijf", "planning software techniek", "automatische offerte maken", "onderhoudsplanning AI"],
        citationSnippet: "Installatiebedrijven met AI-gestuurde planning rijden 20% minder kilometers en kunnen 1 extra klus per monteur per week inplannen.",
        painPoints: [
            "Te veel tijd kwijt aan het maken van complexe offertes",
            "Planning die in de soep loopt door spoedklussen",
            "Moeilijkheid om personeelstekort op te vangen",
            "Niet op tijd factureren van afgeronde werkzaamheden"
        ],
        localStats: {
            stat1: "20%",
            label1: "Efficiëntere planning",
            stat2: "15 min",
            label2: "Tijd voor een standaard offerte"
        },
        solutions: [
            { title: "Photo-to-Quote AI", desc: "Maak een foto van een meterkast of CV-ketel en laat AI direct een concept offerte en materiaallijst maken.", icon: "📸" },
            { title: "Dynamic Schedule Optimizer", desc: "AI herberekent de route van monteurs in real-time bij wijzigingen of files.", icon: "🗓️" },
            { title: "Voice-to-Report", desc: "Monteurs spreken hun werkbonnen in; AI zet het om in een professioneel rapport voor de klant.", icon: "🎙️" }
        ],
        roiExample: {
            hours: "40 uur",
            euro: "€3.200",
            timeframe: "besparing op kantooruren per maand"
        },
        faq: [
            {
                question: "Werkt de planning ook op de telefoon van de monteur?",
                answer: "Ja, de AI-oplossingen zijn volledig mobielvriendelijk en integreren met de apps die uw monteurs al gebruiken."
            },
            {
                question: "Kan de AI ook herkennen welke onderdelen nodig zijn?",
                answer: "Bij veelgebruikte installaties kan de AI op basis van foto's of serienummers direct de benodigde onderdelen signaleren."
            },
            {
                question: "Is het geschikt voor kleine en grote bedrijven?",
                answer: "Onze oplossingen zijn schaalbaar van eenmanszaken tot installatiebedrijven met 50+ monteurs."
            }
        ]
    },
    bouwbedrijven: {
        slug: "bouwbedrijven",
        name: "Bouwsector",
        title: "AI in de Bouw | Slimmer Projectbeheer & Calculatie | AIFAIS",
        description: "Transformeer uw bouwbedrijf met AI. Van automatische hoeveelheidsbepaling tot slimme projectplanning en risico-analyse.",
        h1: "Bouwen aan de Toekomst: AI in Constructie",
        intro: "In de bouw is marge alles. Onze AI help u om faalkosten te reduceren door scherpere calculaties en een strakkere planning van mens en materieel.",
        keywords: ["AI bouwsector", "automatisering bouwbedrijf", "bouw calculatie software", "projectbeheer AI"],
        citationSnippet: "De inzet van AI bij bouwcalculaties verhoogt de nauwkeurigheid met 15%, wat direct zorgt voor minder onvoorziene kosten tijdens de uitvoering.",
        painPoints: [
            "Faalkosten door onnauwkeurige calculaties of tekeningen",
            "Planning van onderaannemers is een dagtaak",
            "Trage communicatie tussen de bouwplaats en kantoor",
            "Moeilijk te managen stroom aan inkoopfacturen en bonnen"
        ],
        localStats: {
            stat1: "12%",
            label1: "Reductie in faalkosten",
            stat2: "50%",
            label2: "Snellere factuurverwerking"
        },
        solutions: [
            { title: "AI Estimator", desc: "Scan bouwtekeningen en laat AI automatisch hoeveelheden berekenen voor hout, beton en staal.", icon: "🏗️" },
            { title: "Site-to-Office Bridge", desc: "AI analyseert foto's van de bouwplaats en matcht deze met de planning voor real-time voortgang.", icon: "🚧" },
            { title: "Smart Procurement AI", desc: "Vergelijk automatisch prijzen van leveranciers en voorspel prijsschommelingen van bouwmaterialen.", icon: "📈" }
        ],
        roiExample: {
            hours: "50 uur",
            euro: "€5.500",
            timeframe: "besparing op calculatie & admin per project"
        },
        faq: [
            {
                question: "Kan de AI ook overweg met BIM-modellen?",
                answer: "Ja, onze geavanceerde modellen kunnen data extraheren uit en communiceren met de meeste BIM-software."
            },
            {
                question: "Helpt AI bij de wet kwaliteitsborging (Wkb)?",
                answer: "Absoluut. De AI kan helpen bij het automatisch verzamelen van bewijslast voor het opleverdossier conform de Wkb."
            },
            {
                question: "Is de interface makkelijk te gebruiken in de keet?",
                answer: "We houden het simpel: veel acties werken via vertrouwde kanalen zoals WhatsApp of eenvoudige mobiele apps."
            }
        ]
    },
    horeca: {
        slug: "horeca",
        name: "Horeca",
        title: "AI voor Horeca | Slimme Reserveringen & Personeelsplanning | AIFAIS",
        description: "Optimaliseer uw restaurant of hotel met AI. Van automatische tafelreserveringen tot slimme inkoop en personeelsroosters.",
        h1: "Gastvrijheid van de Toekomst: AI in de Horeca",
        intro: "In de horeca draait alles om de gast. Wij automatiseren de backend zodat uw team zich volledig kan focussen op service en beleving.",
        keywords: ["AI horeca", "restaurant automatisering", "slimme inkoop horeca", "AI personeelsplanning"],
        citationSnippet: "Horecagelegenheden die AI inzetten voor hun inkoop reduceren voedselverspilling met gemiddeld 15% en verhogen de marge op menu-items.",
        painPoints: [
            "Hoge werkdruk door personeelstekort in de bediening en keuken",
            "Niet-optimale bezetting van tafels door no-shows",
            "Moeilijk te voorspellen inkoop wat leidt tot derving",
            "Beantwoorden van honderden vragen via mail en social media"
        ],
        localStats: {
            stat1: "15%",
            label1: "Minder voedselverspilling",
            stat2: "24/7",
            label2: "Directe respons op vragen"
        },
        solutions: [
            { title: "AI Booking Assistant", desc: "Een slimme agent die via WhatsApp of telefoon reserveringen aanneemt en no-shows minimaliseert met slimme reminders.", icon: "🍴" },
            { title: "Smart Inventory AI", desc: "Voorspel de drukte op basis van weer en events, en krijg een kant-en-klaar inkoopadvies.", icon: "🥘" },
            { title: "Review Auto-Responder", desc: "Laat AI gepersonaliseerd en empathisch reageren op al uw Google en TripAdvisor reviews.", icon: "⭐" }
        ],
        roiExample: {
            hours: "15 uur",
            euro: "€1.800",
            timeframe: "minder derving en admin per maand"
        },
        faq: [
            {
                question: "Kan de AI ook reserveringen in current systemen zetten?",
                answer: "Ja, we integreren met populaire systemen zoals Formitable, TheFork en reserveringsmodules van hotelsoftware."
            },
            {
                question: "Spreekt de AI ook Engels tegen toeristen?",
                answer: "Absoluut. De AI-agent is meertalig en kan gasten in hun eigen taal te woord staan voor reserveringen en vragen."
            },
            {
                question: "Is het ook betaalbaar voor een klein café?",
                answer: "Zeker, we hebben instapmodules die direct waarde leveren tegen een zeer toegankelijk tarief."
            }
        ]
    },
    logistiek: {
        slug: "logistiek",
        name: "Transport & Logistiek",
        title: "AI voor Logistiek | Route Optimalisatie & Warehouse AI | AIFAIS",
        description: "Verhoog de efficiëntie van uw logistieke proces. AI voor slimme routeplanning, vrachtbrieven scannen en voorraadbeheer.",
        h1: "Logistiek in de Hoogste Versnelling",
        intro: "In transport telt elke seconde en elke kilometer. Onze AI helpt u bij het reduceren van lege kilometers en het automatiseren van de papierwinkel.",
        keywords: ["AI logistiek", "transport automatisering", "route optimalisatie software", "voorraadbeheer AI"],
        citationSnippet: "Logistiek dienstverleners die AI-route-optimalisatie inzetten, besparen gemiddeld 12% op brandstofkosten en verhogen de bezettingsgraad per rit.",
        painPoints: [
            "Hoge brandstofkosten door suboptimale routes",
            "Fouten bij het handmatig overtypen van vrachtbrieven en orders",
            "Moeilijkheid om de juiste voorraadniveaus aan te houden",
            "Communicatie met chauffeurs en klanten over aankomsttijden"
        ],
        localStats: {
            stat1: "12%",
            label1: "Besparing op brandstof",
            stat2: "90%",
            label2: "Minder administratief overtypwerk"
        },
        solutions: [
            { title: "Auto-Dispatch Assistant", desc: "Zet inkomende order-mails direct om in geplande ritten in uw TMS zonder tussenkomst van een planner.", icon: "🚛" },
            { title: "OCR Document AI", desc: "Scan vrachtbrieven en CMR's met 99% nauwkeurigheid en koppel ze direct aan het juiste dossier.", icon: "📄" },
            { title: "Predictive Stock AI", desc: "Voorspel tekorten in het magazijn voordat ze ontstaan door historische data en externe trends te analyseren.", icon: "📦" }
        ],
        roiExample: {
            hours: "60 uur",
            euro: "€4.200",
            timeframe: "brandstof & admin besparing per maand"
        },
        faq: [
            {
                question: "Werkt dit met mijn huidige TMS?",
                answer: "Wij bouwen API-koppelingen met de meeste gangbare Transport Management Systemen."
            },
            {
                question: "Kan de AI rekening houden met venstertijden?",
                answer: "Ja, de route-optimalisatie houdt rekening met venstertijden, milieuzones en voertuigspecificaties."
            },
            {
                question: "Hoe snel is de terugverdientijd?",
                answer: "Gezien de directe besparing op brandstof en uren, is de ROI vaak al binnen 4 tot 6 maanden positief."
            }
        ]
    },
    "hr-recruitment": {
        slug: "hr-recruitment",
        name: "HR & Recruitment",
        title: "AI voor Recruitment | CV Screening & Matching | AIFAIS",
        description: "Vind sneller de juiste kandidaat met AI. Automatiseer CV-screening, genereer vacatureteksten en verbeter de kandidaat-ervaring.",
        h1: "De Toekomst van Recruitment: Menselijk werk, AI-kracht",
        intro: "Goede mensen zijn schaars. Onze AI neemt het zoek- en selectiewerk over, zodat u meer tijd heeft voor het echt belangrijke: de persoonlijke klik.",
        keywords: ["AI recruitment", "CV screening software", "vacatureteksten AI", "HR automatisering"],
        citationSnippet: "Recruiters die AI-gestuurde screening gebruiken, verwerken vacatures 3x sneller en verhogen de kwaliteit van de short-list aanzienlijk.",
        painPoints: [
            "Eindeloze uren besteed aan het scrollen door irrelevante CV's",
            "Moeilijkheid om snel persoonlijke feedback te geven aan kandidaten",
            "Vacatures die lang openstaan door gebrek aan bereik",
            "Handmatig inplannen van interviews met meerdere agenda's"
        ],
        localStats: {
            stat1: "70%",
            label1: "Snellere initiële screening",
            stat2: "4x",
            label2: "Meer persoonlijke feedback-momenten"
        },
        solutions: [
            { title: "Smart CV Matcher", desc: "Analyseer honderden CV's op basis van vaardigheden en potentieel, niet alleen op trefwoorden.", icon: "🔍" },
            { title: "Job Design AI", desc: "Genereer inclusieve en wervende vacatureteksten die exact de juiste doelgroep aanspreken.", icon: "📝" },
            { title: "Candidate Nurturing Bot", desc: "Houd kandidaten 24/7 op de hoogte van hun status en beantwoord vragen via een slimme chat.", icon: "🤝" }
        ],
        roiExample: {
            hours: "40 uur",
            euro: "€3.500",
            timeframe: "besparing per recruiter per maand"
        },
        faq: [
            {
                question: "Vervangt de AI de menselijke recruiter?",
                answer: "Nee, de AI fungeert als een super-assistent. De uiteindelijke beslissing en het persoonlijke contact blijven altijd menselijk."
            },
            {
                question: "Hoe zit het met bias (vooroordelen) in AI?",
                answer: "Wij gebruiken 'Fair-AI' instellingen die juist helpen om objectiever te screenen op vaardigheden en zo bias te verminderen."
            },
            {
                question: "Kan dit gekoppeld worden aan AFAS of OTYS?",
                answer: "Ja, wij integreren met de meeste populaire ATS en HRIS systemen voor een naadloze workflow."
            }
        ]
    },
    zorg: {
        slug: "zorg",
        name: "Zorg & Welzijn",
        title: "AI in de Zorg | Minder Administratie, Meer Zachtheid | AIFAIS",
        description: "Verminder de regeldruk in de zorg met AI. Automatisch verslagleggen, slimme triage en efficiënte planning voor zorgverleners.",
        h1: "Zorg met Aandacht: AI als administratief assistent",
        intro: "Zorgverleners willen zorgen, niet typen. Onze AI-oplossingen nemen de administratieve last over, zodat er meer tijd is voor de patiënt.",
        keywords: ["AI in de zorg", "zorg automatisering", "administratieve last zorg AI", "ehealth oplossingen"],
        citationSnippet: "Zorgverleners die AI-spraakherkenning en automatische verslaglegging inzetten, besparen tot 45 minuten aan administratie per dag.",
        painPoints: [
            "Burn-out gevaar door extreme administratieve regeldruk",
            "Lange wachtlijsten door inefficiënte afspraak-triage",
            "Fouten bij handmatige dossieroverdracht en verslaglegging",
            "Hoge kosten voor externe krachten in de planning"
        ],
        localStats: {
            stat1: "45 min",
            label1: "Tijdwinst per dag per zorgverlener",
            stat2: "30%",
            label2: "Efficiëntere patiënten-triage"
        },
        solutions: [
            { title: "Voice-to-ECD", desc: "Spreek uw bevindingen in tijdens of na het consult; AI plaatst het gestructureerd in het juiste dossier.", icon: "🩺" },
            { title: "Smart Triage Assistant", desc: "Analyseer inkomende hulpvragen en prioriteer deze automatisch voor de juiste zorgverlener.", icon: "🏥" },
            { title: "Protocollen AI", desc: "Stel direct vragen aan alle interne protocollen en richtlijnen in begrijpelijke taal.", icon: "📚" }
        ],
        roiExample: {
            hours: "20 uur",
            euro: "€2.400",
            timeframe: "extra tijd voor patiënten per maand"
        },
        faq: [
            {
                question: "Hoe zit het met de privacy van patiënten (NEN 7510)?",
                answer: "Wij voldoen aan de strengste privacy-normen voor de zorg. Alle data wordt versleuteld en verwerkt conform AVG en NEN 7510."
            },
            {
                question: "Werkt dit met ons huidige patiëntendossier?",
                answer: "Ja, we koppelen met de meeste grote EPD/ECD systemen via veilige standaarden (zoals FHIR/HL7)."
            },
            {
                question: "Is de AI ook begrijpelijk voor oudere patiënten?",
                answer: "Onze taalmodellen zijn getraind op begrijpelijkheid en kunnen communicatie aanpassen aan het niveau van de ontvanger."
            }
        ]
    },
    "fitness-sport": {
        slug: "fitness-sport",
        name: "Fitness & Sport",
        title: "AI voor Sportscholen | Ledenbehoud & Marketing | AIFAIS",
        description: "Groei uw fitness-onderneming met AI. Voorspel ledenverloop, automatiseer uw klantervaring en optimaliseer uw groepslesbezetting.",
        h1: "Power-up: AI in de Fitnessbranche",
        intro: "In sport draait alles om motivatie and resultaat. Onze AI helpt u om leden langer vast te houden en uw marketing naar een hoger niveau te tillen.",
        keywords: ["AI fitness", "sportschool automatisering", "ledenbehoud software AI", "fitness marketing"],
        citationSnippet: "Sportscholen die AI-gestuurde voorspellende analyses inzetten op hun ledenbestand, verlagen het verloop (churn) met gemiddeld 20%.",
        painPoints: [
            "Leden die na drie maanden stoppen (uitstroom)",
            "Hoge marketingkosten voor het werven van nieuwe leden",
            "Onderbezetting of juist overvolle groepslessen",
            "Administratieve druk door incasso's en wijzigingen"
        ],
        localStats: {
            stat1: "20%",
            label1: "Hoger ledenbehoud",
            stat2: "15%",
            label2: "Hogere conversie op leads"
        },
        solutions: [
            { title: "Churn Prediction Engine", desc: "AI signaleert welk lid dreigt te stoppen op basis van gedrag, zodat u proactief actie kunt ondernemen.", icon: "🏋️" },
            { title: "24/7 Virtual Coach", desc: "Een AI-agent die vragen over schema's, voeding en openingstijden direct beantwoordt via uw app.", icon: "📱" },
            { title: "Dynamic Class Optimizer", desc: "Optimaliseer uw lesrooster op basis van voorspelde drukte en voorkeuren van uw leden.", icon: "🗓️" }
        ],
        roiExample: {
            hours: "10 uur",
            euro: "€2.100",
            timeframe: "extra omzet door minder opzeggingen/maand"
        },
        faq: [
            {
                question: "Kan de AI ook trainingsschema's maken?",
                answer: "Ja, we kunnen persoonlijke schema's laten genereren op basis van doelen en fysieke parameters van het lid."
            },
            {
                question: "Werkt dit met Sportivity of Virtuagym?",
                answer: "Wij bouwen koppelingen met de meest gebruikte club-management software voor het veilig uitwisselen van data."
            },
            {
                question: "Hoe helpt het bij het werven van nieuwe leden?",
                answer: "De AI analyseert wie uw beste leden zijn en helpt bij het bouwen van 'look-alike' campagnes voor social media."
            }
        ]
    },
    "marketing-bureaus": {
        slug: "marketing-bureaus",
        name: "Marketing & Communicatie",
        title: "AI voor Marketing Bureaus | Schaalbaar Content & Data | AIFAIS",
        description: "Maak uw bureau AI-first. Automatiseer contentcreatie, ads optimalisatie en rapportage voor uw klanten.",
        h1: "The Creative Edge: AI-gepowerde Agency",
        intro: "Creativiteit kan niet geoogst worden door AI, maar de uitvoering wel. Wij helpen bureaus om 5x meer output te leveren met dezelfde kwaliteit.",
        keywords: ["AI marketing bureau", "content automatisering", "ads optimalisatie AI", "agency efficiency"],
        citationSnippet: "Marketing bureaus die AI-workflows integreren voor hun executie, verhogen hun winstmarge per project met gemiddeld 35%.",
        painPoints: [
            "Te veel billable uren kwijt aan repetitieve taken zoals rapportage",
            "Moeite om de enorme vraag naar content (tekst/beeld) bij te benen",
            "Hoge kosten voor junior medewerkers voor standaard werkzaamheden",
            "Druk om als bureau zelf innovatief te blijven op AI gebied"
        ],
        localStats: {
            stat1: "35%",
            label1: "Hogere winstmarge",
            stat2: "5x",
            label2: "Snellere content productie"
        },
        solutions: [
            { title: "Automated Report Builder", desc: "Genereer indrukwekkende maandelijkse rapportages inclusief inzichten en actiepunten in één klik.", icon: "📊" },
            { title: "Multi-Channel Content AI", desc: "Transformeer één blogpost naar LinkedIn updates, nieuwsbrieven en scripts in seconden.", icon: "✍️" },
            { title: "Sentiment & Trend Monitor", desc: "AI scant real-time wat er speelt in de markt van uw klant voor proactief advies.", icon: "🚀" }
        ],
        roiExample: {
            hours: "80 uur",
            euro: "€6.400",
            timeframe: "besparing op uitvoering per maand"
        },
        faq: [
            {
                question: "Is de content wel uniek genoeg voor SEO?",
                answer: "Ja, wij gebruiken geavanceerde prompting en persoonlijke data van uw klanten om unieke, kwalitatieve content te genereren."
            },
            {
                question: "Kunnen wij dit als eigen label verkopen?",
                answer: "Zeker, we bieden white-label mogelijkheden zodat u deze AI-powered diensten onder uw eigen merk kunt voeren."
            },
            {
                question: "Hoe veilig is de data van onze verschillende klanten?",
                answer: "Wij garanderen strikte scheiding tussen klantendata. Data van klant A wordt nooit gebruikt om modellen voor klant B te verbeteren."
            }
        ]
    },
    architecten: {
        slug: "architecten",
        name: "Architectuur & Design",
        title: "AI voor Architecten | Snelle Ontwerpschetsen & Admin | AIFAIS",
        description: "Combineer creativiteit met AI-snelheid. Van automatische wet- en regelgeving checks tot fotorealistische renders in seconden.",
        h1: "Ontwerpen zonder Beperkingen: AI voor Architecten",
        intro: "Laat de techniek het rekenwerk doen, terwijl u zich focust op de esthetiek. Onze AI versnelt het ontwerpproces van schets tot oplevering.",
        keywords: ["AI architectuur", "architectenbureau automatisering", "AI rendering software", "bouwbesluit check AI"],
        citationSnippet: "Architectenbureaus die AI-generatieve ontwerptools gebruiken, verkorten de conceptfase van een project met gemiddeld 60%.",
        painPoints: [
            "Honderden uren kwijt aan het maken van renders en visualisaties",
            "Handmatig controleren van ontwerpen tegen het Bouwbesluit",
            "Hoge werkdruk tijdens prijsvragen en tenders",
            "Administratieve last bij het managen van meerdere projectfasen"
        ],
        localStats: {
            stat1: "60%",
            label1: "Snellere conceptfase",
            stat2: "90%",
            label2: "Tijdwinst op visualisaties"
        },
        solutions: [
            { title: "Instant Render AI", desc: "Zet eenvoudige schetsen om in fotorealistische beelden voor presentaties in seconden, niet in uren.", icon: "🏛️" },
            { title: "Compliance Checker", desc: "Laat AI uw ontwerpen screenen op basis van lokale bestemmingsplannen en bouwvoorschriften.", icon: "📐" },
            { title: "Legacy Knowledge Base", desc: "Doorzoek al uw eerdere projecten en technische details via een intelligente interne zoekmachine.", icon: "📂" }
        ],
        roiExample: {
            hours: "40 uur",
            euro: "€5.000",
            timeframe: "extra capaciteit voor nieuwe projecten/maand"
        },
        faq: [
            {
                question: "Vervangt AI de architect?",
                answer: "Absoluut niet. AI is een krachtig penseel, maar u bent de schilder die de visie en context bepaalt."
            },
            {
                question: "Is het compatibel met Revit of Archicad?",
                answer: "Ja, we integreren met populaire BIM-software om data naadloos uit te wisselen voor analyse en visualisatie."
            },
            {
                question: "Hoe nauwkeurig zijn de AI-checks?",
                answer: "Zeer nauwkeurig voor de eerste scan, maar we adviseren altijd een finale menselijke check voor officiële goedkeuringen."
            }
        ]
    },
    productiebedrijven: {
        slug: "productiebedrijven",
        name: "Productie & Industrie",
        title: "AI in de Productie | Predictive Maintenance & QC | AIFAIS",
        description: "Optimaliseer uw fabriek met AI. Voorspel machine-onderhoud, automatiseer kwaliteitscontroles en verbeter de supply chain.",
        h1: "Industrie 4.0: De Slimme Fabriek",
        intro: "In de maakindustrie is uptime alles. Onze AI-agents monitoren uw processen 24/7 om stilstand te voorkomen en kwaliteit te garanderen.",
        keywords: ["AI productie", "smart industry 4.0", "predictive maintenance AI", "kwaliteitscontrole automatisering"],
        citationSnippet: "Productiebedrijven die AI-gestuurd onderhoud inzetten, verlagen ongeplande stilstand met 30% en verlengen de levensduur van machines.",
        painPoints: [
            "Hoge kosten door onverwachte machinestilstand",
            "Menselijke fouten bij visuele kwaliteitscontroles",
            "Moeite om de productieplanning te optimaliseren bij wisselende vraag",
            "Veel ongestructureerde data uit sensoren waar niets mee gedaan wordt"
        ],
        localStats: {
            stat1: "30%",
            label1: "Minder ongeplande stilstand",
            stat2: "99.9%",
            label2: "Nauwkeurige kwaliteitscontrole"
        },
        solutions: [
            { title: "Predictive Maintenance AI", desc: "Analyseer sensordata and voorspel precies wanneer onderhoud nodig is voordat een defect optreedt.", icon: "⚙️" },
            { title: "Visual Inspection AI", desc: "Gebruik camera's en AI om afwijkingen in producten op de band met topsnelheid te detecteren.", icon: "👁️" },
            { title: "Demand Forecasting", desc: "Optimaliseer uw voorraad en productie op basis van marktvragen, seizoensinvloeden en trends.", icon: "📈" }
        ],
        roiExample: {
            hours: "100 uur",
            euro: "€12.000",
            timeframe: "besparing op stilstand & afkeur per maand"
        },
        faq: [
            {
                question: "Kan de AI ook met oudere machines (legacy) praten?",
                answer: "Ja, via slimme sensoren en IoT-gateways kunnen we vaak ook oudere machines 'slim' maken."
            },
            {
                question: "Wat is de impact op ons personeel?",
                answer: "AI neemt saai en gevaarlijk controle-werk over. Hierdoor kan uw personeel zich focussen op procesbeheer en optimalisatie."
            },
            {
                question: "Is de dataverbinding in de fabriek een probleem?",
                answer: "Nee, we kunnen 'Edge AI' oplossingen installeren die lokaal draaien, zonder dat er een constante snelle cloudverbinding nodig is."
            }
        ]
    }
};

export const sectorDataEn: Record<string, SectorData> = {
    accountants: {
        slug: "accountants",
        name: "Accountancy",
        title: "AI Automation for Accountants | Save 20h/week | AIFAIS",
        description: "Automate invoice processing, time tracking and document management for your accounting firm. Discover how AIFAIS reduces error margins and increases capacity.",
        h1: "The Digital Accountant: Scale without additional personnel",
        intro: "In a sector where accuracy and deadlines are sacred, AI provides the necessary breathing room. We help accounting firms eliminate repetitive work.",
        keywords: ["automation for accountants", "AI accountancy", "accounting software", "efficiency for bookkeeping firms"],
        citationSnippet: "Accounting firms that deploy AI-driven invoice processing and automatic reconciliation reduce administrative pressure by an average of 65%. Our Digital Workers are available 24/7 and 100% accurate.",
        painPoints: [
            "Too much time spent manually typing in invoices",
            "Personnel shortages hindering firm growth",
            "Repetitive admin work leading to turnover among junior staff",
            "Deadlines causing excessive peak periods workload"
        ],
        localStats: {
            stat1: "15-20h",
            label1: "Savings per employee/week",
            stat2: "0%",
            label2: "Error margin in data entry"
        },
        solutions: [
            { title: "Zero-Touch Invoice Processing", desc: "Automatic recognition and booking of purchase invoices directly into your accounting software.", icon: "📑" },
            { title: "AI Dossier Assistant", desc: "Let AI categorize documents, summarize them, and signal missing pieces.", icon: "📁" },
            { title: "Smart Time Reconciliation", desc: "Connect calendars and communication automatically to the right files for flawless billing.", icon: "⏱️" }
        ],
        roiExample: {
            hours: "80 hours",
            euro: "€6,500",
            timeframe: "per month (with 5 employees)"
        },
        faq: [
            {
                question: "Does the AI work with my current accounting software?",
                answer: "Yes, we connect with all major packages like Exact Online, Sage, and Xero via secure API interfaces."
            },
            {
                question: "How secure is my clients' data?",
                answer: "Data security is our priority. We work within European data centers and ensure full GDPR compliance with isolated AI environments."
            },
            {
                question: "Does AI replace the accountant?",
                answer: "No, AI takes over the 'assembly line work'. This gives the accountant more time for advisory, the role that truly adds value for the customer."
            }
        ]
    },
    advocaten: {
        slug: "advocaten",
        name: "Legal",
        title: "AI for Lawyers | Contract Analysis & Case Management | AIFAIS",
        description: "Accelerate legal processes with AI. Contract analysis, case summaries and smart time tracking specially for the legal sector.",
        h1: "Next-Gen Legal: Focus on the case, not the admin",
        intro: "Legal work requires focus. Our AI agents take over the time-consuming reading and sorting work, so you can concentrate on legal strategy.",
        keywords: ["AI for lawyers", "legal automation", "legal tech", "contract analysis software"],
        citationSnippet: "Legal professionals spend up to 30% of their time on non-billable administration. AI models specifically trained on legal regulations can bring this down to less than 5%.",
        painPoints: [
            "Endless hours spent on contract reviews and due diligence",
            "Difficulty in keeping all billable hours accurately recorded",
            "Large amounts of unstructured data in complex cases",
            "High pressure on junior lawyers for administrative prep work"
        ],
        localStats: {
            stat1: "90%",
            label1: "Faster contract analysis",
            stat2: "25%",
            label2: "More billable hours through admin reduction"
        },
        solutions: [
            { title: "Legal Insights Engine", desc: "Scan thousands of case pages and find relevant passages and contradictions instantly.", icon: "⚖️" },
            { title: "Contract AI Helper", desc: "Let AI check drafts for specific clauses and risk profiles in seconds.", icon: "📜" },
            { title: "Automatic Mail Triage", desc: "Categorize incoming client emails and prepare draft responses.", icon: "📧" }
        ],
        roiExample: {
            hours: "15 hours",
            euro: "€3,750",
            timeframe: "per employee/month in extra capacity"
        },
        faq: [
            {
                question: "Can the AI understand complex legal texts?",
                answer: "Yes, our models are specifically configured for legal language and understand the nuances of legal terminology."
            },
            {
                question: "What about professional secrecy and AI?",
                answer: "We implement 'Local LLM' or 'Private Cloud' solutions where your data is never used for training public models."
            },
            {
                question: "What is the implementation time?",
                answer: "A first 'Smart Dossier' prototype can often be operational within your firm within 3 weeks."
            }
        ]
    },
    "e-commerce": {
        slug: "e-commerce",
        name: "E-commerce",
        title: "E-commerce Automation | AI Orderflows & Customer Service | AIFAIS",
        description: "Scale your webshop without extra personnel. AI-driven customer service, order processing and personalized marketing.",
        h1: "Scalable Growth: The AI-Driven Webshop",
        intro: "In e-commerce, speed and scalability are everything. We build the digital infrastructure that allows you to grow 10x with the same team.",
        keywords: ["e-commerce automation", "AI customer service webshop", "orderflow optimization", "shopify ai tools"],
        citationSnippet: "Webshops using AI for their customer service and order processing see a 15% increase in conversion and a 70% decrease in manual ticket handling.",
        painPoints: [
            "Being overwhelmed by repetitive customer questions (where is my package?)",
            "Manual errors when transferring orders to logistics partners",
            "Difficulty being 24/7 available for international customers",
            "High costs for support staff during promotion periods"
        ],
        localStats: {
            stat1: "70%",
            label1: "Automation of support questions",
            stat2: "15%",
            label2: "Higher conversion through AI chat"
        },
        solutions: [
            { title: "24/7 AI-Shop Assistant", desc: "A smart assistant that not only answers questions but also recommends products and handles returns.", icon: "🛒" },
            { title: "Smart Order Bridges", desc: "Connect Shopify, Magento or WooCommerce seamlessly to your warehouse with AI checks for address errors.", icon: "📦" },
            { title: "Review & Sentiment AI", desc: "Automatically analyze all customer reviews and respond proactively to dissatisfied customers.", icon: "⭐" }
        ],
        roiExample: {
            hours: "120 hours",
            euro: "€4,000",
            timeframe: "savings on support costs per month"
        },
        faq: [
            {
                question: "Does this work with Shopify and WooCommerce?",
                answer: "Certainly. We have standard integrations for all major e-commerce platforms and can build custom connections."
            },
            {
                question: "Can binary AI also help with returns?",
                answer: "Yes, the AI can validate the return process, generate labels and fully automate communication with the customer."
            },
            {
                question: "Is it available in multiple languages?",
                answer: "Absolutely. Our AI speaks and understands more than 50 languages, ideal for webshops with international ambitions."
            }
        ]
    },
    makelaars: {
        slug: "makelaars",
        name: "Real Estate",
        title: "AI for Real Estate Agents | Automate Viewings & Leads | AIFAIS",
        description: "Optimize your real estate agency with AI. From automatic lead follow-up to smart property descriptions and 24/7 customer service.",
        h1: "Efficient Real Estate: More deals, less admin",
        intro: "In real estate, it's all about speed and personal contact. We automate the noise so you can focus on the transaction.",
        keywords: ["AI real estate", "property automation", "real estate lead follow-up", "AI property descriptions"],
        citationSnippet: "Real estate agents who use AI for their initial lead follow-up respond within 2 minutes, increasing the chance of a successful appointment by 400%.",
        painPoints: [
            "Too much time spent scheduling viewings",
            "Leads not being followed up outside of office hours",
            "Manually writing unique property texts for every portal",
            "High workload for back-office due to repetitive questions"
        ],
        localStats: {
            stat1: "5 min",
            label1: "Response time for new leads",
            stat2: "60%",
            label2: "Less time spent on administration"
        },
        solutions: [
            { title: "24/7 AI-Agent for Leads", desc: "Let an AI directly respond to inquiries and schedule viewings in your calendar.", icon: "🏠" },
            { title: "Smart Property Writer", desc: "Generate catchy, SEO-optimized property descriptions based on features in seconds.", icon: "✍️" },
            { title: "Automatic File Check", desc: "AI instantly checks if all necessary documents for the sale are complete and valid.", icon: "📂" }
        ],
        roiExample: {
            hours: "25 hours",
            euro: "€2,500",
            timeframe: "savings per agent per month"
        },
        faq: [
            {
                question: "Can the AI also schedule appointments in my CRM?",
                answer: "Yes, we can connect with most real estate CRMs to place viewings directly in the correct calendar."
            },
            {
                question: "Does the AI understand building nuances?",
                answer: "Absolutely, our AI text generation can be trained on your specific tone-of-voice and local market knowledge."
            },
            {
                question: "How does lead follow-up work on weekends?",
                answer: "Our AI agents run 24/7. Even on Sunday night, a lead gets an immediate response and an invitation for a viewing."
            }
        ]
    },
    hypotheekadviseurs: {
        slug: "hypotheekadviseurs",
        name: "Mortgage Advice",
        title: "AI for Mortgage Advisors | Faster Case Management | AIFAIS",
        description: "Automate collecting and checking documents for mortgage applications. Increase turnaround time and customer satisfaction.",
        h1: "Financial Advice 2.0: Focus on the customer",
        intro: "Manually checking payslips and employer statements is a thing of the past. Our AI does the prep work, you provide the expert advice.",
        keywords: ["AI mortgage advice", "financial advisor automation", "AI document check", "mortgage software"],
        citationSnippet: "Mortgage advisors using AI document validation shorten the turnaround time of a case by an average of 3 to 5 business days.",
        painPoints: [
            "Waiting for incomplete documents from customers",
            "Manually checking figures on payslips and annual accounts",
            "High pressure due to strict lender deadlines",
            "Many repetitive questions about application status"
        ],
        localStats: {
            stat1: "4 days",
            label1: "Faster case processing",
            stat2: "95%",
            label2: "First-time-right at lender"
        },
        solutions: [
            { title: "AI-Document Validator", desc: "Scan and validate payslips, IDs, and employer statements for authenticity and data instantly.", icon: "💳" },
            { title: "Status Update Bot", desc: "Automatically keep customers informed of progress via email or WhatsApp.", icon: "📲" },
            { title: "Annual Figures Analyser", desc: "Let AI summarize complex annual accounts for entrepreneurs for quick assessment.", icon: "📊" }
        ],
        roiExample: {
            hours: "30 hours",
            euro: "€4,500",
            timeframe: "extra revenue capacity per advisor/month"
        },
        faq: [
            {
                question: "Is the AI aware of the latest lending standards?",
                answer: "Our systems are continuously updated to comply with current lender standards and regulations."
            },
            {
                question: "How secure is uploading sensitive data?",
                answer: "Extremely secure. We use bank-grade encryption and all data is processed within the EU according to GDPR guidelines."
            },
            {
                question: "Can this be linked to my existing CRM?",
                answer: "Yes, we build connections with the most used CRM systems for mortgage advisors."
            }
        ]
    },
    installatiebedrijven: {
        slug: "installatiebedrijven",
        name: "Installation Tech",
        title: "AI for Installation Companies | Smart Planning & Quotes | AIFAIS",
        description: "Optimize your installation business with AI. Speed up quote creation based on photos and automate your work planning.",
        h1: "The Smart Installer: Growing in Tech",
        intro: "You are good at tech, not at admin. Our AI helps you create quotes faster and plan your technicians more efficiently.",
        keywords: ["AI installation business", "technical planning software", "automatic quote creation", "AI maintenance planning"],
        citationSnippet: "Installation companies with AI-driven planning drive 20% fewer kilometers and can schedule 1 extra job per technician per week.",
        painPoints: [
            "Too much time spent creating complex quotes",
            "Planning disrupted by emergency jobs",
            "Difficulty handling personnel shortages",
            "Not invoicing completed work on time"
        ],
        localStats: {
            stat1: "20%",
            label1: "More efficient planning",
            stat2: "15 min",
            label2: "Time for a standard quote"
        },
        solutions: [
            { title: "Photo-to-Quote AI", desc: "Take a photo of a meter cupboard or boiler and let AI instantly create a draft quote and material list.", icon: "📸" },
            { title: "Dynamic Schedule Optimizer", desc: "AI recalculates technician routes in real-time based on changes or traffic.", icon: "🗓️" },
            { title: "Voice-to-Report", desc: "Technicians speak their work orders; AI converts it into a professional report for the customer.", icon: "🎙️" }
        ],
        roiExample: {
            hours: "40 hours",
            euro: "€3,200",
            timeframe: "savings on office hours per month"
        },
        faq: [
            {
                question: "Does the planning work on the technician's phone?",
                answer: "Yes, the AI solutions are fully mobile-friendly and integrate with the apps your technicians already use."
            },
            {
                question: "Can the AI recognize which parts are needed?",
                answer: "For common installations, the AI can often identify required parts based on photos or serial numbers."
            },
            {
                question: "Is it suitable for small and large companies?",
                answer: "Our solutions are scalable from sole traders to installation companies with 50+ technicians."
            }
        ]
    },
    bouwbedrijven: {
        slug: "bouwbedrijven",
        name: "Construction",
        title: "AI in Construction | Smarter Project Management & Estimation | AIFAIS",
        description: "Transform your construction company with AI. From automatic quantity take-offs to smart project planning and risk analysis.",
        h1: "Building the Future: AI in Construction",
        intro: "In construction, margin is everything. Our AI helps you reduce failure costs through sharper estimations and tighter scheduling of people and equipment.",
        keywords: ["AI construction", "construction automation", "construction estimation software", "AI project management"],
        citationSnippet: "Using AI for construction estimations increases accuracy by 15%, directly reducing unforeseen costs during execution.",
        painPoints: [
            "Failure costs due to inaccurate estimations or drawings",
            "Scheduling subcontractors is a full-time job",
            "Slow communication between the site and the office",
            "Difficult to manage flow of purchase invoices and receipts"
        ],
        localStats: {
            stat1: "12%",
            label1: "Reduction in failure costs",
            stat2: "50%",
            label2: "Faster invoice processing"
        },
        solutions: [
            { title: "AI Estimator", desc: "Scan construction drawings and let AI automatically calculate quantities for wood, concrete, and steel.", icon: "🏗️" },
            { title: "Site-to-Office Bridge", desc: "AI analyzes site photos and matches them with the schedule for real-time progress.", icon: "🚧" },
            { title: "Smart Procurement AI", desc: "Automatically compare supplier prices and predict price fluctuations for building materials.", icon: "📈" }
        ],
        roiExample: {
            hours: "50 hours",
            euro: "€5,500",
            timeframe: "savings on estimation & admin per project"
        },
        faq: [
            {
                question: "Can the AI handle BIM models?",
                answer: "Yes, our advanced models can extract data from and communicate with most BIM software."
            },
            {
                question: "Does AI help with quality assurance regulations?",
                answer: "Absolutely. AI can help automatically gather evidence for the completion dossier according to regulations."
            },
            {
                question: "Is the interface easy to use on-site?",
                answer: "We keep it simple: many actions work through familiar channels like WhatsApp or simple mobile apps."
            }
        ]
    },
    horeca: {
        slug: "horeca",
        name: "Hospitality",
        title: "AI for Hospitality | Smart Booking & Staff Planning | AIFAIS",
        description: "Optimize your restaurant or hotel with AI. From automatic table reservations to smart procurement and staff rosters.",
        h1: "Hospitality of the Future: AI in Hospitality",
        intro: "In hospitality, it's all about the guest. We automate the backend so your team can focus entirely on service and experience.",
        keywords: ["AI hospitality", "restaurant automation", "smart procurement hospitality", "AI staff planning"],
        citationSnippet: "Hospitality venues using AI for their procurement reduce food waste by an average of 15% and increase margins on menu items.",
        painPoints: [
            "High workload due to staff shortages in service and kitchen",
            "Suboptimal table occupancy due to no-shows",
            "Difficult to predict procurement leading to waste",
            "Answering hundreds of questions via email and social media"
        ],
        localStats: {
            stat1: "15%",
            label1: "Less food waste",
            stat2: "24/7",
            label2: "Immediate response to questions"
        },
        solutions: [
            { title: "AI Booking Assistant", desc: "A smart agent that takes reservations via WhatsApp or phone and minimizes no-shows with smart reminders.", icon: "🍴" },
            { title: "Smart Inventory AI", desc: "Predict busy periods based on weather and events, and get ready-made procurement advice.", icon: "🥘" },
            { title: "Review Auto-Responder", desc: "Let AI respond personally and empathetically to all your Google and TripAdvisor reviews.", icon: "⭐" }
        ],
        roiExample: {
            hours: "15 hours",
            euro: "€1,800",
            timeframe: "less waste and admin per month"
        },
        faq: [
            {
                question: "Can the AI also place bookings in current systems?",
                answer: "Yes, we integrate with popular systems like Formitable, TheFork and reservation modules of hotel software."
            },
            {
                question: "Does the AI also speak English to tourists?",
                answer: "Absolutely. The AI agent is multilingual and can assist guests in their own language for reservations and questions."
            },
            {
                question: "Is it also affordable for a small café?",
                answer: "Certainly, we have entry-level modules that deliver immediate value at a very accessible rate."
            }
        ]
    },
    logistiek: {
        slug: "logistiek",
        name: "Transport & Logistics",
        title: "AI for Logistics | Route Optimization & Warehouse AI | AIFAIS",
        description: "Increase the efficiency of your logistical process. AI for smart route planning, waypoint scanning and inventory management.",
        h1: "Logistics at Full Speed",
        intro: "In transport, every second and every kilometer counts. Our AI helps you reduce empty kilometers and automate paper work.",
        keywords: ["AI logistics", "transport automation", "route optimization software", "inventory management AI"],
        citationSnippet: "Logistics providers using AI route optimization save an average of 12% on fuel costs and increase occupancy rate per trip.",
        painPoints: [
            "High fuel costs due to suboptimal routes",
            "Errors in manually retyping waybills and orders",
            "Difficulty maintaining the correct inventory levels",
            "Communication with drivers and customers about arrival times"
        ],
        localStats: {
            stat1: "12%",
            label1: "Fuel savings",
            stat2: "90%",
            label2: "Less administrative retyping"
        },
        solutions: [
            { title: "Auto-Dispatch Assistant", desc: "Instantly convert incoming order emails into planned trips in your TMS without planner intervention.", icon: "🚛" },
            { title: "OCR Document AI", desc: "Scan waybills and CMRs with 99% accuracy and link them directly to the correct file.", icon: "📄" },
            { title: "Predictive Stock AI", desc: "Predict warehouse shortages before they occur by analyzing historical data and external trends.", icon: "📦" }
        ],
        roiExample: {
            hours: "60 hours",
            euro: "€4,200",
            timeframe: "fuel & admin savings per month"
        },
        faq: [
            {
                question: "Does this work with my current TMS?",
                answer: "We build API connections with most commonly used Transport Management Systems."
            },
            {
                question: "Can the AI take window times into account?",
                answer: "Yes, route optimization accounts for window times, environmental zones and vehicle specifications."
            },
            {
                question: "How fast is the payback period?",
                answer: "Given the direct savings on fuel and hours, ROI is often positive within 4 to 6 months."
            }
        ]
    },
    "hr-recruitment": {
        slug: "hr-recruitment",
        name: "HR & Recruitment",
        title: "AI for Recruitment | CV Screening & Matching | AIFAIS",
        description: "Find the right candidate faster with AI. Automate CV screening, generate job descriptions and improve candidate experience.",
        h1: "The Future of Recruitment: Human Work, AI Power",
        intro: "Good people are scarce. Our AI takes over the search and selection work, giving you more time for what's really important: the personal connection.",
        keywords: ["AI recruitment", "CV screening software", "AI job descriptions", "HR automation"],
        citationSnippet: "Recruiters using AI-driven screening process job openings 3x faster and significantly increase the quality of the short-list.",
        painPoints: [
            "Endless hours spent scrolling through irrelevant CVs",
            "Difficulty providing quick personal feedback to candidates",
            "Vacancies staying open long due to lack of reach",
            "Manually scheduling interviews across multiple calendars"
        ],
        localStats: {
            stat1: "70%",
            label1: "Faster initial screening",
            stat2: "4x",
            label2: "More personal feedback moments"
        },
        solutions: [
            { title: "Smart CV Matcher", desc: "Analyze hundreds of CVs based on skills and potential, not just keywords.", icon: "🔍" },
            { title: "Job Design AI", desc: "Generate inclusive and engaging job descriptions that appeal to exactly the right target group.", icon: "📝" },
            { title: "Candidate Nurturing Bot", desc: "Keep candidates informed of their status 24/7 and answer questions via a smart chat.", icon: "🤝" }
        ],
        roiExample: {
            hours: "40 hours",
            euro: "€3,500",
            timeframe: "savings per recruiter per month"
        },
        faq: [
            {
                question: "Does AI replace the human recruiter?",
                answer: "No, AI acts as a super-assistant. The final decision and personal contact always remain human."
            },
            {
                question: "What about bias in AI?",
                answer: "We use 'Fair-AI' settings that help screen more objectively based on skills and thus reduce bias."
            },
            {
                question: "Can this be linked to AFAS or OTYS?",
                answer: "Yes, we integrate with most popular ATS and HRIS systems for a seamless workflow."
            }
        ]
    },
    zorg: {
        slug: "zorg",
        name: "Healthcare",
        title: "AI in Healthcare | Less Admin, More Care | AIFAIS",
        description: "Reduce administrative pressure in healthcare with AI. Automatic reporting, smart triage and efficient scheduling for care providers.",
        h1: "Care with Attention: AI as administrative assistant",
        intro: "Care providers want to care, not type. Our AI solutions take over the administrative burden, so there is more time for the patient.",
        keywords: ["AI in healthcare", "healthcare automation", "admin burden healthcare AI", "ehealth solutions"],
        citationSnippet: "Care providers using AI speech recognition and automatic reporting save up to 45 minutes of administration per day.",
        painPoints: [
            "Burnout risk due to extreme administrative pressure",
            "Long waiting lists due to inefficient appointment triage",
            "Errors in manual file transfer and reporting",
            "High costs for external staff in scheduling"
        ],
        localStats: {
            stat1: "45 min",
            label1: "Time gain per day per care provider",
            stat2: "30%",
            label2: "More efficient patient triage"
        },
        solutions: [
            { title: "Voice-to-ECD", desc: "Speak your findings during or after consultation; AI places it structured in the correct file.", icon: "🩺" },
            { title: "Smart Triage Assistant", desc: "Analyze incoming help requests and prioritize them automatically for the right care provider.", icon: "🏥" },
            { title: "Protocols AI", desc: "Ask questions to all internal protocols and guidelines in clear language directly.", icon: "📚" }
        ],
        roiExample: {
            hours: "20 hours",
            euro: "€2,400",
            timeframe: "extra time for patients per month"
        },
        faq: [
            {
                question: "What about patient privacy (GDPR)?",
                answer: "We comply with the strictest privacy standards for healthcare. All data is encrypted and processed according to GDPR and local standards."
            },
            {
                question: "Does this work with our current patient files?",
                answer: "Yes, we connect with most major EMR/EHR systems via secure standards."
            },
            {
                question: "Is AI also understandable for older patients?",
                answer: "Our language models are trained for clarity and can adapt communication to the level of the recipient."
            }
        ]
    },
    "fitness-sport": {
        slug: "fitness-sport",
        name: "Fitness & Sport",
        title: "AI for Gyms | Member Retention & Marketing | AIFAIS",
        description: "Grow your fitness business with AI. Predict member churn, automate customer experience and optimize group class occupancy.",
        h1: "Power-up: AI in the Fitness Industry",
        intro: "In sport, it's all about motivation and results. Our AI helps you retain members longer and take your marketing to a higher level.",
        keywords: ["AI fitness", "gym automation", "AI member retention software", "fitness marketing"],
        citationSnippet: "Gyms using AI-driven predictive analytics on their member base reduce churn by an average of 20%.",
        painPoints: [
            "Members quitting after three months (churn)",
            "High marketing costs for acquiring new members",
            "Under-occupancy or overcrowded group classes",
            "Administrative pressure from collections and changes"
        ],
        localStats: {
            stat1: "20%",
            label1: "Higher member retention",
            stat2: "15%",
            label2: "Higher lead conversion"
        },
        solutions: [
            { title: "Churn Prediction Engine", desc: "AI signals which member is about to quit based on behavior, so you can take proactive action.", icon: "🏋️" },
            { title: "24/7 Virtual Coach", desc: "An AI agent that answers questions about schedules, nutrition, and opening hours instantly via your app.", icon: "📱" },
            { title: "Dynamic Class Optimizer", desc: "Optimize your class schedule based on predicted attendance and member preferences.", icon: "🗓️" }
        ],
        roiExample: {
            hours: "10 hours",
            euro: "€2,100",
            timeframe: "extra revenue from reduced churn/month"
        },
        faq: [
            {
                question: "Can the AI also create training schedules?",
                answer: "Yes, we can generate personalized schedules based on member goals and physical parameters."
            },
            {
                question: "Does this work with club management software?",
                answer: "We build connections with the most commonly used club management software for secure data exchange."
            },
            {
                question: "How does it help with acquiring new members?",
                answer: "The AI analyzes who your best members are and helps build 'look-alike' campaigns for social media."
            }
        ]
    },
    "marketing-bureaus": {
        slug: "marketing-bureaus",
        name: "Marketing & Communication",
        title: "AI for Marketing Agencies | Scalable Content & Data | AIFAIS",
        description: "Make your agency AI-first. Automate content creation, ads optimization and reporting for your clients.",
        h1: "The Creative Edge: AI-powered Agency",
        intro: "Creativity cannot be harvested by AI, but execution can. We help agencies deliver 5x more output with the same quality.",
        keywords: ["AI marketing agency", "content automation", "AI ads optimization", "agency efficiency"],
        citationSnippet: "Marketing agencies integrating AI workflows for execution increase their profit margin per project by an average of 35%.",
        painPoints: [
            "Too many billable hours spent on repetitive tasks like reporting",
            "Struggle to keep up with huge demand for content (text/image)",
            "High costs for junior staff for standard tasks",
            "Pressure to stay innovative on AI as an agency"
        ],
        localStats: {
            stat1: "35%",
            label1: "Higher profit margin",
            stat2: "5x",
            label2: "Faster content production"
        },
        solutions: [
            { title: "Automated Report Builder", desc: "Generate impressive monthly reports including insights and action points with one click.", icon: "📊" },
            { title: "Multi-Channel Content AI", desc: "Transform one blog post into LinkedIn updates, newsletters and scripts in seconds.", icon: "✍️" },
            { title: "Sentiment & Trend Monitor", desc: "AI scans what's happening in your client's market in real-time for proactive advice.", icon: "🚀" }
        ],
        roiExample: {
            hours: "80 hours",
            euro: "€6,400",
            timeframe: "savings on execution per month"
        },
        faq: [
            {
                question: "Is AI content unique enough for SEO?",
                answer: "Yes, we use advanced prompting and client-specific data to generate unique, high-quality content."
            },
            {
                question: "Can we sell this as our own label?",
                answer: "Certainly, we offer white-label options so you can offer these AI-powered services under your own brand."
            },
            {
                question: "How secure is data from different clients?",
                answer: "We guarantee strict separation between client data. Data from client A is never used to improve models for client B."
            }
        ]
    },
    architecten: {
        slug: "architecten",
        name: "Architecture & Design",
        title: "AI for Architects | Fast Design Sketches & Admin | AIFAIS",
        description: "Combine creativity with AI speed. From automatic regulation checks to photorealistic renders in seconds.",
        h1: "Design without Limits: AI for Architects",
        intro: "Let tech do the calculating, while you focus on aesthetics. Our AI speeds up the design process from sketch to delivery.",
        keywords: ["AI architecture", "architect agency automation", "AI rendering software", "AI building code check"],
        citationSnippet: "Architectural firms using AI-generative design tools shorten the concept phase of a project by an average of 60%.",
        painPoints: [
            "Hundreds of hours spent creating renders and visualizations",
            "Manually checking designs against building codes",
            "High pressure during competitions and tenders",
            "Administrative burden managing multiple project phases"
        ],
        localStats: {
            stat1: "60%",
            label1: "Faster concept phase",
            stat2: "90%",
            label2: "Time saved on visualizations"
        },
        solutions: [
            { title: "Instant Render AI", desc: "Convert simple sketches into photorealistic images for presentations in seconds, not hours.", icon: "🏛️" },
            { title: "Compliance Checker", desc: "Let AI screen your designs based on local zoning plans and building regulations.", icon: "📐" },
            { title: "Legacy Knowledge Base", desc: "Search all your previous projects and technical details via an intelligent internal search engine.", icon: "📂" }
        ],
        roiExample: {
            hours: "40 hours",
            euro: "€5,000",
            timeframe: "extra capacity for new projects/month"
        },
        faq: [
            {
                question: "Does AI replace the architect?",
                answer: "Absolutly not. AI is a powerful brush, but you are the painter who determines vision and context."
            },
            {
                question: "Is it compatible with Revit or Archicad?",
                answer: "Yes, we integrate with popular BIM software to exchange data seamlessly for analysis and visualization."
            },
            {
                question: "How accurate are the AI checks?",
                answer: "Very accurate for the first scan, but we always advise a final human check for official approvals."
            }
        ]
    },
    productiebedrijven: {
        slug: "productiebedrijven",
        name: "Manufacturing",
        title: "AI in Manufacturing | Predictive Maintenance & QC | AIFAIS",
        description: "Optimize your factory with AI. Predict machine maintenance, automate quality controls and improve the supply chain.",
        h1: "Industry 4.0: The Smart Factory",
        intro: "In manufacturing, uptime is everything. Our AI agents monitor your processes 24/7 to prevent downtime and ensure quality.",
        keywords: ["AI manufacturing", "smart industry 4.0", "AI predictive maintenance", "quality control automation"],
        citationSnippet: "Manufacturing companies using AI-driven maintenance reduce unplanned downtime by 30% and extend machine life.",
        painPoints: [
            "High costs due to unexpected machine downtime",
            "Human errors during visual quality controls",
            "Struggle to optimize production planning with varying demand",
            "Lots of unstructured sensor data where nothing is done with it"
        ],
        localStats: {
            stat1: "30%",
            label1: "Less unplanned downtime",
            stat2: "99.9%",
            label2: "Accurate quality control"
        },
        solutions: [
            { title: "Predictive Maintenance AI", desc: "Analyze sensor data and predict exactly when maintenance is needed before a defect occurs.", icon: "⚙️" },
            { title: "Visual Inspection AI", desc: "Use cameras and AI to detect deviations in products on the line at top speed.", icon: "👁️" },
            { title: "Demand Forecasting", desc: "Optimize your inventory and production based on market demands, seasonal influences and trends.", icon: "📈" }
        ],
        roiExample: {
            hours: "100 hours",
            euro: "€12,000",
            timeframe: "savings on downtime & rejection per month"
        },
        faq: [
            {
                question: "Can AI talk to legacy machines?",
                answer: "Yes, through smart sensors and IoT gateways, we can often make older machines 'smart'."
            },
            {
                question: "What is the impact on our staff?",
                answer: "AI takes over boring and dangerous inspection work. This allows your staff to focus on process management and optimization."
            },
            {
                question: "Is factory data connection an issue?",
                answer: "No, we can install 'Edge AI' solutions that run locally, without requiring a constant high-speed cloud connection."
            }
        ]
    }
};
