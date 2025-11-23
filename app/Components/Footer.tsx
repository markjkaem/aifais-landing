import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-gray-200 bg-black mt-12"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2" itemProp="name">
            Aifais
          </h3>
          <address
            className="not-italic"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <p itemProp="streetAddress">Kampenringweg 45D</p>
            <p>
              <span itemProp="postalCode">2803 PE</span>{" "}
              <span itemProp="addressLocality">Gouda</span>
            </p>
            <meta itemProp="addressCountry" content="NL" />
          </address>
          {/* ✅ VUL IN ALS JE TELEFOONNUMMER & EMAIL PUBLIEK WILT */}
          {/* <p itemProp="telephone">
                <a href="tel:+31XXXXXXXXX" className="hover:underline">
                  +31 (0)XX XXX XXXX
                </a>
              </p>
              <p itemProp="email">
                <a href="mailto:info@aifais.com" className="hover:underline">
                  info@aifais.com
                </a>
              </p> */}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2">Zakelijke informatie</h3>
          <p>
            BTW: <span className="italic">NL000099998B57</span>
          </p>
          <p itemProp="vatID">KvK: 27199999</p>
          <p>Verzekerd & gecertificeerd</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2">Navigatie</h3>
          <nav aria-label="Footer navigatie">
            <Link
              href="/"
              className="hover:underline block mb-2"
              itemProp="url"
            >
              Home
            </Link>
            <Link href="/portfolio" className="hover:underline block mb-2">
              Portfolio
            </Link>
            <Link href="/contact" className="hover:underline block mb-2">
              Contact
            </Link>
            <Link href="/agv" className="hover:underline block mb-2">
              Algemene Voorwaarden
            </Link>
            <Link href="/privacy" className="hover:underline block mb-2">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} <span itemProp="name">Aifais</span> —
          Alle rechten voorbehouden
        </p>
        <p className="mt-2">
          n8n Workflow Automatisering Specialist | Gevestigd in Gouda, Nederland
        </p>
      </div>
    </footer>
  );
}
