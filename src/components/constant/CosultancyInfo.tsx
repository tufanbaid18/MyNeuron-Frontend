export default function ConsultancyInfo() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <header className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Nature of Consultancy
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Bencos, through the MyNeuron gateway, provides professional
                genomics and bioinformatics consultancy services. Payments
                collected under this scope are strictly for service-based
                engagements and do not involve the sale, supply, or delivery of
                any physical goods.
              </p>
            </header>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Genomics Sequencing Services (NGS)
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Services include Next Generation Sequencing (NGS) for research,
                translational, and clinical applications. These services involve
                the processing and analysis of biological samples submitted by
                clients and may include:
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-600 list-disc pl-5">
                <li>DNA Sequencing</li>
                <li>RNA Sequencing</li>
                <li>Whole Genome Sequencing (WGS)</li>
                <li>Whole Exome Sequencing (WES)</li>
                <li>Transcriptome Sequencing</li>
                <li>Epigenome Sequencing</li>
                <li>Metagenome and microbiome sequencing</li>
                <li>Targeted and application-specific NGS workflows</li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Payments under this category cover scientific consultation,
                sequencing execution, quality control, data generation, and
                delivery of sequencing outputs as per the agreed service scope.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Bioinformatics as a Service (BIAAS)
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments may be applied towards Bioinformatics as a Service
                (BIAAS), providing computational and analytical support for
                genomics data generated through sequencing.
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Primary, secondary, and tertiary analysis of NGS data</li>
                <li>
                  Data processing, alignment, variant calling, annotation, and
                  interpretation
                </li>
                <li>
                  Application of standard and/or customised bioinformatics
                  pipelines
                </li>
                <li>
                  Delivery of analytical outputs, datasets, and summary reports
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                This service is provided as a professional analytical
                consultancy and does not involve the transfer of intellectual
                property or physical assets unless separately agreed in writing.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Clinical Genomics Reporting Services
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                For clinical and translational use cases, payments may also
                cover clinical genomics reporting services, including:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>
                  Interpretation of genomic variants identified through AI
                  Flag-based software systems
                </li>
                <li>
                  Preparation of structured genomic reports for clinical
                  reference
                </li>
                <li>
                  Analytical reporting supporting healthcare professionals in
                  diagnostic and treatment decisions
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                These reports are advisory and analytical in nature and
                constitute professional consultancy services.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Nature and Mode of Service Delivery
              </h2>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>All services are intangible and non-physical</li>
                <li>
                  Deliverables are provided digitally (raw data, datasets,
                  reports)
                </li>
                <li>
                  No physical goods, consumables, or laboratory products are
                  sold
                </li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Purpose of Payment Collection
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments collected under this scope are strictly towards:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>
                  Execution of genomics sequencing and consultancy services
                </li>
                <li>Bioinformatics analysis of genomic data</li>
                <li>
                  Preparation and delivery of genomic and clinical reports
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Consultancy services, genomics services, and event-related
                payments are governed under separate scopes and declarations.
              </p>
            </section>

            {/* Footer */}
            <footer className="border-t pt-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                Bencos Healthcare Solutions Pvt. Ltd.
              </p>
              <p>Genomics & Bioinformatics Consultancy Scope Declaration</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
