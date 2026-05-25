import { useEffect, useState } from 'react';
import anime from 'animejs';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1. Logo Animation
    const logoAnim = anime({
      targets: '.preloader-logo',
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .5)'
    });

    // 2. Progress Bar animation
    const progressAnim = anime({
      targets: '.preloader-bar',
      width: ['0%', '100%'],
      duration: 1500,
      easing: 'easeInOutQuart',
      complete: function () {
        // Hide preloader, show content
        anime({
          targets: '.preloader',
          opacity: 0,
          duration: 500,
          easing: 'easeOutQuart',
          complete: () => {
            setVisible(false);
          }
        });
      }
    });

    // FAIL-SAFE: Guarantee preloader unmounts after 2 seconds to unfreeze scroll/interaction
    const fallbackTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      logoAnim.pause();
      progressAnim.pause();
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader fixed inset-0 z-[99999] bg-[#070707] flex flex-col items-center justify-center pointer-events-auto">
      {/* Royal Background Grid lines overlay inside preloader */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      <div className="relative flex flex-col items-center space-y-6 max-w-xs text-center z-10 px-4">
        {/* Crown logo wrapper */}
        <div className="preloader-logo opacity-0 flex flex-col items-center space-y-3">
          <div className="w-16 h-16 flex items-center justify-center border border-brand-gold rounded-full bg-brand-black shadow-2xl">
            <span className="text-brand-gold text-3xl leading-none select-none">♚</span>
          </div>
          <span className="font-playfair text-xl md:text-2xl font-bold tracking-[0.25em] text-brand-gold gold-glow block">
            ANJUMAN
          </span>
          <span className="text-[9px] text-brand-white/40 tracking-[0.2em] font-mono uppercase block">
            THE ROYAL COURT OF MEWAR
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-48 h-[2px] bg-brand-white/10 rounded-full overflow-hidden relative mt-4">
          <div className="preloader-bar absolute left-0 top-0 bottom-0 bg-gold-gradient w-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
