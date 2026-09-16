import { services } from '../data/services';
import SectionHeading from './SectionHeading';
import ServiceCard from './ServiceCard';

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden border-t border-line/8 bg-black-950 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-25" />
        <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/[0.04] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="02"
          kicker="Capabilities"
          title="Our BIM Services"
          description="From reality capture to intelligent digital construction models."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-visible border border-line/10 bg-transparent sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="relative -m-px"
            >
              <ServiceCard service={service} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
