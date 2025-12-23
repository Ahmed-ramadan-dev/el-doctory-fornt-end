import logoIcon from '@/assets/new-logo.png';

const Header = () => {
    return (
        <header className="w-full">
            {/* شريط الراعي الرسمي المتحرك */}
            <div className="bg-primary/95 text-white py-1 overflow-hidden whitespace-nowrap border-b border-white/10 shadow-sm">
                <style>
                    {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee-slow {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 20s linear infinite;
            }
          `}
                </style>
                <div className="animate-marquee-slow font-cairo text-[12px] font-bold">
          <span className="mx-10 flex-inline items-center gap-2">
            🌟 د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                    <span className="mx-10 flex-inline items-center gap-2">
            🌟  د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                    <span className="mx-10 flex-inline items-center gap-2">
            🌟  د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                    <span className="mx-10 flex-inline items-center gap-2">
            🌟  د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                    <span className="mx-10 flex-inline items-center gap-2">
            🌟  د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                    <span className="mx-10 flex-inline items-center gap-2">
            🌟  د/ محمود الجبالي - أخصائي الباطنة والكُلى 🌟
          </span>
                </div>
            </div>

            {/* منطقة اللوجو */}
            <div className="flex justify-center py-5 px-4">
                <div className="flex items-center gap-3 header-glass px-7 py-3.5 rounded-full animate-scale-in shadow-lg">
                    <img src={logoIcon} alt="El-Doctory Logo" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-bold text-primary font-cairo tracking-wide">El-Doctory</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
