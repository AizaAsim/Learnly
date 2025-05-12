import React, { ReactNode } from 'react';

interface AnimatedBackgroundProps {
    children: ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
    return (
        <div className="relative h-full p-10">
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-20 h-full">
                <div className="w-full h-full" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}></div>
            </div>

            {/* SVG Animated Shapes - Increased opacity for better visibility */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 300"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Floating Circle */}
                <circle
                    cx="750"
                    cy="70"
                    r="30"
                    fill="#F59E0B"
                    opacity="0.3"
                >
                    <animate
                        attributeName="cy"
                        values="70;90;70"
                        dur="6s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.3;0.4;0.3"
                        dur="6s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Floating Triangle */}
                <polygon
                    points="150,30 180,80 120,80"
                    fill="#3182ce"
                    opacity="0.3"
                >
                    <animate
                        attributeName="points"
                        values="150,30 180,80 120,80; 155,25 185,75 125,75; 150,30 180,80 120,80"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 150 55"
                        to="360 150 55"
                        dur="20s"
                        repeatCount="indefinite"
                    />
                </polygon>

                {/* Floating Hexagon */}
                <polygon
                    points="850,200 870,180 900,180 920,200 900,220 870,220"
                    fill="#10B981"
                    opacity="0.25"
                >
                    <animate
                        attributeName="opacity"
                        values="0.25;0.35;0.25"
                        dur="7s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 885 200"
                        to="360 885 200"
                        dur="30s"
                        repeatCount="indefinite"
                    />
                </polygon>

                {/* Floating Square */}
                <rect
                    x="260"
                    y="200"
                    width="50"
                    height="50"
                    rx="4"
                    fill="#1E3A8A"
                    opacity="0.25"
                >
                    <animate
                        attributeName="y"
                        values="200;210;200"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="x"
                        values="260;265;260"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 285 225"
                        to="360 285 225"
                        dur="25s"
                        repeatCount="indefinite"
                    />
                </rect>

                {/* Math Symbols */}
                <text
                    x="500"
                    y="60"
                    fontFamily="Arial, sans-serif"
                    fontSize="24"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    π
                    <animate
                        attributeName="y"
                        values="60;70;60"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.25;0.35;0.25"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </text>

                <text
                    x="650"
                    y="150"
                    fontFamily="Arial, sans-serif"
                    fontSize="24"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    ∑
                    <animate
                        attributeName="y"
                        values="150;160;150"
                        dur="9s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.25;0.35;0.25"
                        dur="9s"
                        repeatCount="indefinite"
                    />
                </text>

                {/* Floating Diamond */}
                <polygon
                    points="400,100 420,120 400,140 380,120"
                    fill="#F59E0B"
                    opacity="0.25"
                >
                    <animate
                        attributeName="points"
                        values="400,100 420,120 400,140 380,120; 405,105 425,125 405,145 385,125; 400,100 420,120 400,140 380,120"
                        dur="12s"
                        repeatCount="indefinite"
                    />
                </polygon>

                {/* Connecting Lines */}
                <g opacity="0.2" stroke="#FFFFFF" strokeWidth="1.5">
                    <line x1="150" y1="55" x2="260" y2="225">
                        <animate
                            attributeName="opacity"
                            values="0.2;0.3;0.2"
                            dur="8s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="400" y1="120" x2="500" y2="60">
                        <animate
                            attributeName="opacity"
                            values="0.2;0.3;0.2"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="650" y1="150" x2="750" y2="70">
                        <animate
                            attributeName="opacity"
                            values="0.2;0.3;0.2"
                            dur="12s"
                            repeatCount="indefinite"
                        />
                    </line>
                    <line x1="885" y1="200" x2="750" y2="70">
                        <animate
                            attributeName="opacity"
                            values="0.2;0.3;0.2"
                            dur="9s"
                            repeatCount="indefinite"
                        />
                    </line>
                </g>

                {/* Small Floating Particles - Larger and more visible */}
                <g>
                    <circle cx="220" cy="80" r="4" fill="#FFFFFF" opacity="0.3">
                        <animate
                            attributeName="cy"
                            values="80;95;80"
                            dur="15s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="cx"
                            values="220;230;220"
                            dur="15s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    <circle cx="550" cy="250" r="5" fill="#FFFFFF" opacity="0.3">
                        <animate
                            attributeName="cy"
                            values="250;235;250"
                            dur="18s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="cx"
                            values="550;565;550"
                            dur="18s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    <circle cx="800" cy="150" r="4" fill="#FFFFFF" opacity="0.3">
                        <animate
                            attributeName="cy"
                            values="150;165;150"
                            dur="20s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="cx"
                            values="800;785;800"
                            dur="20s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>

                {/* Accent Lines - Brand-colored - Thicker and more visible */}
                <path
                    d="M100,150 Q200,100 300,150"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.25"
                >
                    <animate
                        attributeName="d"
                        values="M100,150 Q200,100 300,150; M100,160 Q200,110 300,160; M100,150 Q200,100 300,150"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                </path>

                <path
                    d="M600,80 Q700,130 800,80"
                    stroke="#10B981"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.25"
                >
                    <animate
                        attributeName="d"
                        values="M600,80 Q700,130 800,80; M600,90 Q700,140 800,90; M600,80 Q700,130 800,80"
                        dur="12s"
                        repeatCount="indefinite"
                    />
                </path>

                {/* Additional visibly animated elements */}
                <circle cx="320" cy="150" r="25" fill="#3182ce" opacity="0.3">
                    <animate
                        attributeName="r"
                        values="25;28;25"
                        dur="5s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* More Math Symbols */}
                <text
                    x="200"
                    y="100"
                    fontFamily="Arial, sans-serif"
                    fontSize="22"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    +
                </text>

                <text
                    x="350"
                    y="200"
                    fontFamily="Arial, sans-serif"
                    fontSize="22"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    =
                </text>

                <text
                    x="700"
                    y="120"
                    fontFamily="Arial, sans-serif"
                    fontSize="22"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    ×
                </text>

                <text
                    x="480"
                    y="180"
                    fontFamily="Arial, sans-serif"
                    fontSize="22"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    ÷
                </text>

                <text
                    x="620"
                    y="220"
                    fontFamily="Arial, sans-serif"
                    fontSize="22"
                    fill="#FFFFFF"
                    opacity="0.25"
                >
                    √
                </text>

                {/* Formula element - more prominent */}
                <text
                    x="450"
                    y="250"
                    fontFamily="Arial, sans-serif"
                    fontSize="16"
                    fill="#FFFFFF"
                    opacity="0.3"
                >
                    E = mc²
                    <animate
                        attributeName="opacity"
                        values="0.3;0.4;0.3"
                        dur="7s"
                        repeatCount="indefinite"
                    />
                </text>

                <text
                    x="250"
                    y="150"
                    fontFamily="Arial, sans-serif"
                    fontSize="16"
                    fill="#FFFFFF"
                    opacity="0.3"
                >
                    f(x)
                </text>
            </svg>

            {/* Render the children with proper z-index */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;