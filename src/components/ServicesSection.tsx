import { useState } from 'react';
import { Service, LanguageType } from '../types';
import { LUXURY_SERVICES } from '../data';

interface ServicesSectionProps {
  language: LanguageType;
  onGoToEnquiry: () => void;
}

export default function ServicesSection({ language, onGoToEnquiry }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20" id="services-palace-section">
      
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-brand-gold font-accent tracking-widest text-xs uppercase font-semibold">
          {language === 'EN' ? 'MAJESTIC PALACE INDULGENCES' : 'शाही विश्राम और उत्तम सेवाएं'}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-brand-white mt-1 uppercase tracking-wide">
          {language === 'EN' ? 'Bespoke Amenities & Lifestyles' : 'राजसी विलासिता और जीवन शैली'}
        </h2>
        <div className="w-24 h-[1px] bg-brand-gold/25 mx-auto mt-4"></div>
      </div>

      {/* Services Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {LUXURY_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="group relative h-96 rounded-xl overflow-hidden border border-brand-gold/15 hover:border-brand-gold/45 transition-luxury bg-brand-black shadow-2xl flex flex-col justify-end"
          >
            {/* Visual background image with slight darken */}
            <div
              className="absolute inset-0 bg-cover bg-center filter brightness-90 group-hover:scale-110 transition-transform duration-[6000ms] select-none"
              style={{ backgroundImage: `url(${srv.image})` }}
            />
            
            {/* Dark heavy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/35 to-transparent pointer-events-none" />

            {/* Float icon marker */}
            <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-brand-black/85 border border-brand-gold/20 flex items-center justify-center text-brand-gold text-lg group-hover:bg-[#C9A84C] group-hover:text-brand-black transition-luxury shadow-xl">
              <i className={`fa-solid ${srv.icon}`}></i>
            </div>

            {/* Service details over overlay */}
            <div className="p-6 md:p-8 relative z-10 space-y-3.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                {srv.timing}
              </span>

              <h3 className="font-serif text-2xl text-brand-white tracking-wide uppercase">
                {language === 'EN' ? srv.name : srv.nameHI}
              </h3>

              <p className="text-xs text-brand-white/85 leading-relaxed font-sans max-w-md line-clamp-2">
                {language === 'EN' ? srv.description : srv.descriptionHI}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 justify-between">
                {/* View inclusions action */}
                <button
                  onClick={() => setSelectedService(srv)}
                  className="px-4 py-2 bg-brand-black/75 hover:bg-gold-gradient hover:text-brand-navy text-brand-cream text-[10px] font-bold uppercase tracking-widest rounded border border-brand-gold/15 transition-all cursor-pointer focus:outline-none"
                >
                  {language === 'EN' ? 'Consult Inclusions' : 'विशेष सेवा विवरण देखें'}
                </button>

                <button
                  onClick={onGoToEnquiry}
                  className="text-xs text-brand-gold hover:text-brand-cream flex items-center gap-1.5 focus:outline-none"
                >
                  <span>{language === 'EN' ? 'Butler Request' : 'बटलर अनुरोध'}</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* SERVICE MODAL INCLUSIONS DETAIL VIEWER */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop wrapper */}
          <div className="absolute inset-0 bg-brand-black/92 backdrop-blur-md" onClick={() => setSelectedService(null)} />

          <div className="relative w-full max-w-xl bg-brand-navy/95 rounded-xl border border-brand-gold/30 p-8 text-brand-white glass-panel shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex flex-col items-center text-center mb-6">
              <i className={`fa-solid ${selectedService.icon} text-brand-gold text-3xl mb-3`}></i>
              <h3 className="font-serif text-2xl text-brand-gold uppercase tracking-widest gold-glow">
                {language === 'EN' ? selectedService.name : selectedService.nameHI}
              </h3>
              <p className="text-xs font-mono text-brand-cream/80 italic tracking-wider mt-1">{selectedService.timing}</p>
            </div>

            <p className="text-xs text-brand-white/85 leading-relaxed mb-6 text-center font-sans">
              {language === 'EN' ? selectedService.description : selectedService.descriptionHI}
            </p>

            <span className="block text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-3 border-b border-brand-gold/15 pb-2">
              ✨ {language === 'EN' ? 'Exclusive Inclusions & Features' : 'शाही सेवा समावेश व विशेषताएं'}
            </span>

            <ul className="space-y-3 mb-8">
              {selectedService.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-xs text-brand-white/90 font-sans font-medium">
                  <i className="fa-solid fa-check-double text-[#C9A84C] mt-0.5 text-xs shrink-0"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedService(null);
                  onGoToEnquiry();
                }}
                className="flex-1 py-3.5 bg-gold-gradient text-brand-navy text-xs font-black uppercase tracking-widest rounded transition-all text-center hover:brightness-115 cursor-pointer shadow-lg"
              >
                {language === 'EN' ? 'Request Royal Consultation' : 'शाही परामर्श हेतु आवेदन करें'}
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="px-6 py-3.5 border border-brand-gold/15 text-brand-cream text-xs font-medium uppercase tracking-widest rounded transition-luxury hover:border-brand-gold focus:outline-none"
              >
                {language === 'EN' ? 'Dismiss' : 'बंद करें'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
