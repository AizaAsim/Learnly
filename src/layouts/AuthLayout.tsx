import { AuthHeader } from "@/components/layout/AuthHeader";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Outlet } from "react-router-dom";
import WebLogo from "/img/web-logo.svg";

export const AuthLayout = () => {
  const { isMobile, isTablet } = useDeviceType();
  return (
    <div className="h-screen flex flex-col bg-white md:min-w-full">
      {isMobile || isTablet ? (
        <>
          <AuthHeader />
          <main className="flex-1 px-6 mt-[29px]">
            <Outlet />
          </main>
        </>
      ) : (
        <main className="flex-1 min-w-full h-full mt-0 flex items-center justify-center bg-white">
          <div className="flex min-w-full h-full">
            {/* Animation container */}
            <div className="w-[640px] relative overflow-hidden">
              {/* The SVG animation */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 800" className="absolute inset-0 w-full h-full">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F9FAFB" />
                    <stop offset="100%" stopColor="#E5E7EB" />
                  </linearGradient>

                  {/* Filters for glow effects */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Dot pattern */}
                  <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#64748B" opacity="0.3" />
                  </pattern>
                </defs>

                {/* Background */}
                <rect width="100%" height="100%" fill="url(#bgGradient)" />
                <rect width="100%" height="100%" fill="url(#dotPattern)" />

                {/* Center group for central elements */}
                <g transform="translate(320, 400)">
                  {/* Central logo placeholder - golden circle with pulsing effect */}
                  <circle cx="0" cy="0" r="60" fill="#F59E0B" opacity="0.9" filter="url(#glow)">
                    <animate attributeName="r" values="60;65;60" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Orbiting elements around the center */}
                  <g>
                    {/* Blue orbiting circle */}
                    <circle cx="0" cy="-120" r="20" fill="#3182ce" opacity="0.8">
                      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
                    </circle>

                    {/* Gray orbiting square */}
                    <rect x="-15" y="110" width="30" height="30" fill="#64748B" opacity="0.7">
                      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="25s" repeatCount="indefinite" />
                    </rect>

                    {/* Gold orbiting triangle */}
                    <polygon points="0,-15 15,15 -15,15" fill="#F59E0B" opacity="0.8" transform="translate(110, 0)">
                      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="22s" repeatCount="indefinite" additive="sum" />
                      <animateTransform attributeName="transform" type="rotate" from="0 110 0" to="360 110 0" dur="8s" repeatCount="indefinite" additive="sum" />
                    </polygon>
                  </g>
                </g>

                {/* Book stack with animation */}
                <g transform="translate(180, 250)">
                  <rect x="-75" y="-20" width="150" height="180" rx="5" fill="#1E3A8A" transform="rotate(-10)">
                    <animate attributeName="transform" values="rotate(-10); rotate(-8); rotate(-10)" dur="6s" repeatCount="indefinite" />
                  </rect>
                  <rect x="-75" y="-25" width="150" height="180" rx="5" fill="#3182ce" transform="rotate(-5)">
                    <animate attributeName="transform" values="rotate(-5); rotate(-3); rotate(-5)" dur="7s" repeatCount="indefinite" />
                  </rect>
                  <rect x="-75" y="-30" width="150" height="180" rx="5" fill="#60A5FA" transform="rotate(0)">
                    <animate attributeName="transform" values="rotate(0); rotate(2); rotate(0)" dur="8s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* Graduation cap with movement */}
                <g transform="translate(450, 180) scale(0.7)">
                  <rect x="-60" y="0" width="120" height="20" fill="#1E3A8A" />
                  <polygon points="0,-40 80,0 -80,0" fill="#1E3A8A" />
                  <circle cx="0" cy="-15" r="8" fill="#F59E0B" />
                  <rect x="-5" y="-15" width="10" height="40" fill="#F59E0B" />
                  <animateTransform attributeName="transform" type="translate"
                    values="450,180; 445,175; 450,180"
                    dur="5s" repeatCount="indefinite" additive="sum" />
                </g>

                {/* More floating geometric shapes */}

                {/* Blue hexagon with rotation and movement */}
                <polygon points="500,300 530,325 530,375 500,400 470,375 470,325" fill="#3182ce" opacity="0.8">
                  <animateTransform attributeName="transform" type="rotate" from="0 500 350" to="360 500 350" dur="20s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.9;0.8" dur="5s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate"
                    values="0,0; 10,10; 0,0"
                    dur="8s" repeatCount="indefinite" additive="sum" />
                </polygon>

                {/* Gold pentagon with movement */}
                <polygon points="120,400 140,380 160,390 150,420 110,420" fill="#F59E0B" opacity="0.7">
                  <animate attributeName="points"
                    values="120,400 140,380 160,390 150,420 110,420; 115,395 135,375 155,385 145,415 105,415; 120,400 140,380 160,390 150,420 110,420"
                    dur="10s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="0 135 400" to="360 135 400"
                    dur="30s" repeatCount="indefinite" />
                </polygon>

                {/* Gray triangle with movement */}
                <polygon points="300,650 350,700 250,700" fill="#64748B" opacity="0.7">
                  <animate attributeName="points"
                    values="300,650 350,700 250,700; 310,640 360,690 260,690; 300,650 350,700 250,700"
                    dur="10s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate"
                    values="0,0; 10,-10; 0,0"
                    dur="7s" repeatCount="indefinite" />
                </polygon>

                {/* Blue rhombus with movement and rotation */}
                <polygon points="150,520 180,550 150,580 120,550" fill="#3182ce" opacity="0.8">
                  <animate attributeName="points"
                    values="150,520 180,550 150,580 120,550; 155,525 185,555 155,585 125,555; 150,520 180,550 150,580 120,550"
                    dur="8s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="0 150 550" to="360 150 550"
                    dur="25s" repeatCount="indefinite" />
                </polygon>

                {/* Gold octagon with pulsing and rotation */}
                <polygon points="500,600 520,580 540,580 560,600 560,620 540,640 520,640 500,620" fill="#F59E0B" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.9;0.7" dur="6s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="0 530 610" to="360 530 610"
                    dur="30s" repeatCount="indefinite" />
                </polygon>

                {/* Green element - using highlight color */}
                <polygon points="400,500 425,510 425,530 400,540 375,530 375,510" fill="#10B981" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.9;0.7" dur="7s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate" from="0 400 520" to="360 400 520" dur="26s" repeatCount="indefinite" />
                </polygon>

                {/* Various small floating particles with more dynamic movement */}

                {/* Small gold circle with complex movement */}
                <circle cx="100" cy="400" r="10" fill="#F59E0B" opacity="0.7">
                  <animate attributeName="cy" values="400;350;380;400" dur="15s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="100;120;90;100" dur="15s" repeatCount="indefinite" />
                  <animate attributeName="r" values="10;12;9;10" dur="8s" repeatCount="indefinite" />
                </circle>

                {/* Small blue square with rotation and movement */}
                <rect x="400" y="100" width="15" height="15" fill="#3182ce" opacity="0.7">
                  <animate attributeName="y" values="100;80;120;100" dur="12s" repeatCount="indefinite" />
                  <animate attributeName="x" values="400;420;380;400" dur="12s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate" from="0 407.5 107.5" to="360 407.5 107.5" dur="10s" repeatCount="indefinite" />
                </rect>

                {/* Small gray triangle with movement */}
                <polygon points="550,200 560,220 540,220" fill="#64748B" opacity="0.7">
                  <animate attributeName="points"
                    values="550,200 560,220 540,220; 553,193 563,213 543,213; 550,200 560,220 540,220"
                    dur="8s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate"
                    values="0,0; 20,10; -10,20; 0,0"
                    dur="20s" repeatCount="indefinite" />
                </polygon>

                {/* Blue circle with movement */}
                <circle cx="600" cy="500" r="12" fill="#1E3A8A" opacity="0.8">
                  <animate attributeName="cy" values="500;480;520;500" dur="18s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="600;580;620;600" dur="18s" repeatCount="indefinite" />
                  <animate attributeName="r" values="12;15;10;12" dur="9s" repeatCount="indefinite" />
                </circle>

                {/* Green circle with movement */}
                <circle cx="520" cy="220" r="8" fill="#10B981" opacity="0.6">
                  <animate attributeName="cy" values="220;235;205;220" dur="13s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="520;505;535;520" dur="13s" repeatCount="indefinite" />
                  <animate attributeName="r" values="8;10;7;8" dur="7s" repeatCount="indefinite" />
                </circle>

                {/* Gold square with movement and rotation */}
                <rect x="250" y="250" width="15" height="15" fill="#F59E0B" opacity="0.7" transform="rotate(45, 257.5, 257.5)">
                  <animate attributeName="y" values="250;230;260;250" dur="14s" repeatCount="indefinite" />
                  <animate attributeName="x" values="250;260;230;250" dur="14s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="rotate"
                    from="45 257.5 257.5" to="405 257.5 257.5"
                    dur="20s" repeatCount="indefinite" />
                </rect>

                {/* More mathematical symbols with animation */}
                <g fontFamily="Arial" fill="#64748B">
                  <text x="100" y="100" fontSize="18" opacity="0.5">E = mc²
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 20,10; -10,20; 0,0"
                      dur="25s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.7;0.5" dur="8s" repeatCount="indefinite" />
                  </text>

                  <text x="500" y="400" fontSize="20" opacity="0.5">∑ f(x)
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; -15,25; 10,-5; 0,0"
                      dur="20s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="10s" repeatCount="indefinite" />
                  </text>

                  <text x="300" y="200" fontSize="22" opacity="0.5">π
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 15,-10; -20,5; 0,0"
                      dur="22s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="12s" repeatCount="indefinite" />
                  </text>

                  <text x="450" y="150" fontSize="19" opacity="0.5">∫ dx
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; -10,-15; 20,10; 0,0"
                      dur="18s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.7;0.5" dur="9s" repeatCount="indefinite" />
                  </text>

                  <text x="200" y="450" fontSize="21" opacity="0.5">Δx
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 20,15; -10,-10; 0,0"
                      dur="23s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="11s" repeatCount="indefinite" />
                  </text>

                  <text x="350" y="570" fontSize="20" opacity="0.5">y = mx + b
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; -15,15; 10,-20; 0,0"
                      dur="30s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.7;0.5" dur="15s" repeatCount="indefinite" />
                  </text>

                  <text x="520" y="300" fontSize="18" opacity="0.5">a² + b² = c²
                    <animateTransform attributeName="transform" type="translate"
                      values="0,0; 20,-15; -10,25; 0,0"
                      dur="28s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="14s" repeatCount="indefinite" />
                  </text>
                </g>

                {/* Dynamic connecting lines that fade in and out */}
                <g stroke="#64748B" strokeWidth="1.5">
                  <line x1="200" y1="150" x2="300" y2="200">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="8s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="200;220;190;200" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="150;170;140;150" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="300;280;310;300" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="200;180;210;200" dur="20s" repeatCount="indefinite" />
                  </line>

                  <line x1="300" y1="200" x2="400" y2="100">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="12s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="300;310;290;300" dur="24s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="200;190;210;200" dur="24s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="400;390;410;400" dur="24s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="100;110;90;100" dur="24s" repeatCount="indefinite" />
                  </line>

                  <line x1="400" y1="100" x2="500" y2="300">
                    <animate attributeName="opacity" values="0.3;0.5;0.3" dur="10s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="400;410;390;400" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="100;120;90;100" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="500;490;510;500" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="300;290;310;300" dur="22s" repeatCount="indefinite" />
                  </line>

                  <line x1="150" y1="300" x2="250" y2="450">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="14s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="150;160;140;150" dur="26s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="300;310;290;300" dur="26s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="250;240;260;250" dur="26s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="450;440;460;450" dur="26s" repeatCount="indefinite" />
                  </line>

                  <line x1="500" y1="500" x2="350" y2="570">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="11s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="500;490;510;500" dur="18s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="500;510;490;500" dur="18s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="350;360;340;350" dur="18s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="570;560;580;570" dur="18s" repeatCount="indefinite" />
                  </line>

                  <line x1="320" y1="400" x2="450" y2="180">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="9s" repeatCount="indefinite" />
                    <animate attributeName="x1" values="320;330;310;320" dur="21s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="400;410;390;400" dur="21s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="450;440;460;450" dur="21s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="180;190;170;180" dur="21s" repeatCount="indefinite" />
                  </line>
                </g>

                {/* Green accent lines */}
                <g stroke="#10B981" strokeWidth="1.5" opacity="0.5">
                  <line x1="320" y1="400" x2="400" y2="500">
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="7s" repeatCount="indefinite" />
                  </line>
                  <line x1="520" y1="220" x2="450" y2="300">
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="9s" repeatCount="indefinite" />
                  </line>
                </g>

                {/* Small floating particles with more complex movement */}
                <g>
                  <circle cx="120" cy="200" r="3" fill="#3182ce" opacity="0.7">
                    <animate attributeName="cy" values="200;150;250;200" dur="25s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="120;150;100;120" dur="25s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="550" cy="350" r="4" fill="#F59E0B" opacity="0.7">
                    <animate attributeName="cy" values="350;320;380;350" dur="28s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="550;580;520;550" dur="28s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="400" cy="450" r="5" fill="#64748B" opacity="0.7">
                    <animate attributeName="cy" values="450;500;400;450" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="400;350;450;400" dur="22s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="300" cy="150" r="3" fill="#1E3A8A" opacity="0.7">
                    <animate attributeName="cy" values="150;200;100;150" dur="19s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="300;250;350;300" dur="19s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="500" cy="600" r="4" fill="#F59E0B" opacity="0.7">
                    <animate attributeName="cy" values="600;550;650;600" dur="27s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="500;550;450;500" dur="27s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="180" cy="350" r="3" fill="#10B981" opacity="0.7">
                    <animate attributeName="cy" values="350;300;400;350" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="180;230;130;180" dur="20s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Light rays emanating from center */}
                <g stroke="#F59E0B" strokeWidth="1" opacity="0.3">
                  <line x1="320" y1="400" x2="270" y2="300">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
                  </line>
                  <line x1="320" y1="400" x2="220" y2="430">
                    <animate attributeName="opacity" values="0.3;0.5;0.3" dur="7s" repeatCount="indefinite" />
                  </line>
                  <line x1="320" y1="400" x2="350" y2="500">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
                  </line>
                  <line x1="320" y1="400" x2="420" y2="380">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
                  </line>
                  <line x1="320" y1="400" x2="380" y2="310">
                    <animate attributeName="opacity" values="0.3;0.5;0.3" dur="9s" repeatCount="indefinite" />
                  </line>
                </g>

                {/* Additional accent elements using brand colors */}

                {/* Green sparkles */}
                <g fill="#10B981">
                  <circle cx="250" cy="320" r="2" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="250" r="2" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;3;2" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="350" cy="500" r="2" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="5s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;3;2" dur="5s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Royal Blue deep elements */}
                <g fill="#1E3A8A" opacity="0.4">
                  <path d="M100,300 Q150,250 200,300 Q250,350 300,300" stroke="#1E3A8A" strokeWidth="2" fill="none">
                    <animate attributeName="opacity" values="0.4;0.6;0.4" dur="10s" repeatCount="indefinite" />
                  </path>
                  <path d="M400,200 Q450,150 500,200 Q550,250 600,200" stroke="#1E3A8A" strokeWidth="2" fill="none">
                    <animate attributeName="opacity" values="0.4;0.6;0.4" dur="12s" repeatCount="indefinite" />
                  </path>
                </g>

                {/* Gold accent elements */}
                <path d="M150,600 C200,580 250,620 300,600" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.8;0.6" dur="8s" repeatCount="indefinite" />
                </path>
                <path d="M450,600 C500,580 550,620 600,600" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.8;0.6" dur="9s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-[60px] px-5">
              <img src={WebLogo} alt="logo" />
              <div className="w-[426px]">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default AuthLayout;