import type { JSX } from "react";

export default function ProductInfo(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <header className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Nature of Products
              </h1>
            </header>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Bencos, through the MyNeuron platform, is engaged in the
              advertisement, marketing, and sale of genomics-related physical
              goods and software products. Payments collected under this scope
              are strictly towards the supply of goods and software offerings
              and are subject to applicable Goods and Services Tax (GST)
              regulations.
            </p>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Supply of Physical Laboratory & Genomics Products
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments may be collected for the sale and supply of tangible
                laboratory and genomics products, classified as goods under GST
                law and invoiced under appropriate HSN (Harmonised System of
                Nomenclature) codes.
              </p>

              <p className="text-gray-600 mb-4 leading-relaxed">
                These goods may include, but are not limited to:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Sample collection and preservation tubes (DNA, RNA, cfDNA,
                  blood, and liquid biopsy collection tubes)
                </li>
                <li>Nucleic acid stabilisation and transport consumables</li>
                <li>Whole Exome Sequencing (WES) library preparation kits</li>
                <li>Targeted sequencing and custom library preparation kits</li>
                <li>Other genomics and molecular workflow consumables</li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Supply of Software Products & Digital Platforms
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments may also relate to the sale, licensing, or
                subscription-based access to software products and digital
                platforms, including:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  TWINE BI bioinformatics and data interpretation software
                </li>
                <li>
                  Digital platforms for genomic data management, analysis, and
                  visualisation
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Depending on the mode of supply, software offerings may be
                treated under GST as goods or services, including packaged
                software, licensed software, cloud-based access, or usage-based
                subscriptions.
              </p>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Such supplies are invoiced under applicable HSN or SAC codes in
                accordance with GST provisions.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Advertisement & Product Listing Services
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments may also be collected towards advertisement, marketing,
                and product listing services, which may include:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Product listing and catalog presentation</li>
                <li>Promotional content and marketing material</li>
                <li>Demonstration or limited-access product showcases</li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Nature & Mode of Supply
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  <strong>Physical Goods:</strong> Supplied and delivered
                  through appropriate logistics or courier services
                </li>
                <li>
                  <strong>Software Products:</strong> Supplied through digital
                  access, license activation, or subscription enablement
                </li>
                <li>
                  Each transaction is supported by a tax invoice indicating HSN
                  or SAC codes, applicable GST rate, and tax amount
                </li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Purpose of Payment Collection
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments collected under this scope are strictly for:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Sale and supply of genomics and laboratory goods</li>
                <li>
                  Sale or licensed access to software products and platforms
                </li>
                <li>
                  Advertisement and promotional listing of Bencos-branded
                  products
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Collected amounts are utilised solely for product supply,
                software access provision, marketing execution, logistics, and
                statutory tax compliance.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Compliance & Scope Clarification
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  All supplies are subject to GST laws and regulations in force
                  in India
                </li>
                <li>
                  Goods and services are invoiced separately where applicable,
                  with clear GST classification
                </li>
                <li>
                  Consultancy services, genomics services, and event-related
                  payments are governed under separate scopes and declarations
                </li>
              </ul>
            </section>

            {/* Footer */}
            <footer className="border-t pt-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                Bencos Healthcare Solutions Pvt. Ltd.
              </p>
              <p>Product Supply & GST Scope Declaration</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
