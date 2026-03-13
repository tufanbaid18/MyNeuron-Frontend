const EventsInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <header className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Genomics Advancements Through Convergence Conference
              </h1>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Payments collected for the Genomics Advancements Through
                Convergence (GATC) conference via the MyNeuron gateway are
                strictly limited to event-related participation and engagement
                services. These payments apply exclusively to conference
                registration, exhibition participation, and sponsorship-related
                interests as outlined below.
              </p>
            </header>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Conference Registration Services
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments collected under conference registration are for
                participation in the GATC conference. Registration categories
                may include:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Delegate / Attendee registration</li>
                <li>Academic / Student registration</li>
                <li>Industry / Corporate registration</li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Registration fees may vary based on registration timelines,
                including early, standard, or late/on-spot registration.
              </p>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Payment entitles registered participants to access and
                participation based on the selected registration category, which
                may include:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>
                  Entry and access to the conference venue on registered dates
                </li>
                <li>
                  Attendance at scientific sessions, keynote lectures, panels,
                  and workshops
                </li>
                <li>
                  Access to conference materials (digital or physical where
                  applicable)
                </li>
                <li>Participation in networking and engagement sessions</li>
              </ul>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Exhibition Participation Services
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments may also be collected for exhibition participation at
                GATC. Exhibition-related payments may entitle the exhibitor to:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>
                  Allocation of exhibition space or booth as per the selected
                  package
                </li>
                <li>
                  Permission to display products, services, or informational
                  materials
                </li>
                <li>
                  Professional interaction with conference attendees during
                  exhibition hours
                </li>
                <li>
                  Inclusion in exhibitor listings or event collaterals where
                  applicable
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Exhibition participation is subject to event guidelines, space
                availability, and exhibitor-specific terms communicated
                separately.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Sponsorship & Partnership Participation
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments collected towards sponsorship or partnership interests
                are for association with the GATC conference under defined
                sponsorship categories.
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Brand visibility and recognition during the event</li>
                <li>Inclusion in promotional or event-related materials</li>
                <li>Access to sponsor-specific engagement opportunities</li>
                <li>
                  Participation in sponsor-designated sessions or activities
                </li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                All sponsorship deliverables are governed by written agreements
                mutually agreed upon before or after payment.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Purpose of Payment Collection
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                Payments collected under this scope are strictly used for:
              </p>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Conference registration and attendee participation</li>
                <li>Exhibition space allocation and exhibitor participation</li>
                <li>Sponsorship and partnership engagement</li>
              </ul>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Funds are utilised for event planning, venue arrangements,
                logistics, technical infrastructure, content delivery, and
                operational execution of the conference.
              </p>
            </section>

            {/* Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Compliance & Clarifications
              </h2>

              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>
                  Registration, exhibition, and sponsorship fees are
                  non-refundable once services are initiated unless stated
                  otherwise in writing
                </li>
                <li>
                  Registration fees do not constitute the sale of goods or
                  financial products
                </li>
                <li>
                  Each payment corresponds to a specific event service category
                  and is supported by appropriate documentation or invoices
                </li>
                <li>
                  Payments are valid only for the specific edition and dates of
                  the conference
                </li>
                <li>
                  Consultancy services, genomics services, and non-event
                  offerings are governed under separate scopes and declarations
                </li>
              </ul>
            </section>

            {/* Footer */}
            <footer className="border-t pt-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                Genomics Advancements Through Convergence (GATC)
              </p>
              <p>Event Payments & Participation Scope Declaration</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsInfo;
