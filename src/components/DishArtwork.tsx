import React from 'react';
import { Dish } from '../types';

interface DishArtworkProps {
  artworkId: Dish['artworkId'] | 'green-bowl-hero' | 'protein-house-hero';
  className?: string;
}

export const DishArtwork: React.FC<DishArtworkProps> = ({ artworkId, className = '' }) => {
  switch (artworkId) {
    case 'harvest-grain-bowl':
    case 'green-bowl-hero':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#EDF5F1] via-[#F7F3E9] to-[#E3EEE9] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Soft linen plate shadow */}
            <circle cx="102" cy="105" r="76" fill="#D5D0C3" opacity="0.45" />
            {/* Ceramic bowl outer rim */}
            <circle cx="100" cy="100" r="74" fill="#FFFFFF" stroke="#E5E1D6" strokeWidth="2.5" />
            {/* Bowl inner well */}
            <circle cx="100" cy="100" r="62" fill="#FBF9F4" />
            {/* Spinach leaves */}
            <ellipse cx="72" cy="82" rx="22" ry="13" transform="rotate(-25 72 82)" fill="#1F6F54" />
            <ellipse cx="128" cy="116" rx="20" ry="12" transform="rotate(28 128 116)" fill="#2D8A68" />
            <ellipse cx="78" cy="126" rx="18" ry="11" transform="rotate(15 78 126)" fill="#379A74" />
            {/* Quinoa & Farro grain base */}
            <circle cx="102" cy="96" r="30" fill="#E6CFA3" />
            <circle cx="94" cy="90" r="2.2" fill="#B68B4C" />
            <circle cx="105" cy="85" r="2.4" fill="#C49A5B" />
            <circle cx="114" cy="95" r="2" fill="#A97D3F" />
            <circle cx="98" cy="102" r="2.3" fill="#B68B4C" />
            <circle cx="88" cy="99" r="2.1" fill="#C49A5B" />
            <circle cx="109" cy="106" r="2.2" fill="#A97D3F" />
            {/* Roasted pumpkin cubes */}
            <rect x="65" y="92" width="17" height="16" rx="4" transform="rotate(-12 65 92)" fill="#D9732B" />
            <rect x="115" y="72" width="16" height="15" rx="4" transform="rotate(18 115 72)" fill="#E38237" />
            <rect x="108" y="114" width="15" height="14" rx="4" transform="rotate(-8 108 114)" fill="#CD6621" />
            {/* Spiced chickpeas */}
            <circle cx="86" cy="70" r="6" fill="#E0B15A" />
            <circle cx="98" cy="65" r="5.5" fill="#D4A048" />
            <circle cx="77" cy="112" r="6" fill="#E0B15A" />
            <circle cx="129" cy="94" r="5.8" fill="#D4A048" />
            {/* Ruby pomegranate arils */}
            <circle cx="96" cy="92" r="3.5" fill="#B8253E" />
            <circle cx="106" cy="97" r="3.2" fill="#C9334B" />
            <circle cx="90" cy="106" r="3.4" fill="#B8253E" />
            <circle cx="122" cy="86" r="3" fill="#C9334B" />
            <circle cx="80" cy="84" r="3" fill="#B8253E" />
            {/* Pepitas & vinaigrette swirl */}
            <path
              d="M66 98 Q95 75 130 104"
              fill="none"
              stroke="#7DB46C"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.75"
            />
            <ellipse cx="101" cy="76" rx="4" ry="2" transform="rotate(35 101 76)" fill="#4D7C4F" />
            <ellipse cx="116" cy="106" rx="4" ry="2" transform="rotate(-20 116 106)" fill="#4D7C4F" />
          </svg>
        </div>
      );

    case 'teriyaki-rice-bowl':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#F7EFE2] via-[#FAF6EE] to-[#EFE5D2] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="102" cy="105" r="76" fill="#D5CCB8" opacity="0.45" />
            {/* Dark stoneware bowl */}
            <circle cx="100" cy="100" r="74" fill="#2B322F" />
            <circle cx="100" cy="100" r="64" fill="#37403C" />
            {/* Jasmine rice half */}
            <path d="M44 102 A56 56 0 0 0 154 102 Z" fill="#F8F6F0" />
            {/* Steamed broccoli florets */}
            <circle cx="68" cy="78" r="13" fill="#2A7B4F" />
            <circle cx="80" cy="70" r="11" fill="#358F5E" />
            <circle cx="62" cy="90" r="10" fill="#226641" />
            {/* Glazed teriyaki tofu cubes */}
            <rect x="92" y="64" width="22" height="20" rx="5" transform="rotate(10 92 64)" fill="#8B3A18" />
            <rect x="116" y="76" width="21" height="19" rx="5" transform="rotate(-14 116 76)" fill="#A4481D" />
            <rect x="98" y="88" width="20" height="18" rx="5" transform="rotate(6 98 88)" fill="#7A3112" />
            {/* Glossy glaze highlights */}
            <path d="M98 70 L108 72" stroke="#E2955A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M122 82 L131 80" stroke="#E2955A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Edamame & pickled cucumber */}
            <ellipse cx="136" cy="106" rx="10" ry="6" transform="rotate(-30 136 106)" fill="#6EB557" />
            <ellipse cx="122" cy="118" rx="10" ry="6" transform="rotate(20 122 118)" fill="#6EB557" />
            <circle cx="72" cy="116" r="11" fill="#A5D68B" stroke="#53934B" strokeWidth="2" />
            {/* Sesame seeds */}
            <circle cx="100" cy="118" r="1.8" fill="#E8D2A6" />
            <circle cx="108" cy="124" r="1.8" fill="#E8D2A6" />
            <circle cx="92" cy="127" r="1.8" fill="#1F2421" />
            <circle cx="114" cy="115" r="1.8" fill="#E8D2A6" />
          </svg>
        </div>
      );

    case 'mango-sticky-rice':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#FBF1DF] via-[#FDF7EC] to-[#F7E7CA] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="102" cy="105" r="74" fill="#DDD2BF" opacity="0.4" />
            <circle cx="100" cy="100" r="72" fill="#FFFFFF" stroke="#EAE1CF" strokeWidth="2.5" />
            {/* Pandan leaf accent */}
            <path d="M52 130 Q95 148 148 122 Q105 128 52 130 Z" fill="#4E945B" />
            {/* Sweet coconut sticky rice mound */}
            <ellipse cx="82" cy="96" rx="32" ry="26" fill="#FAF6EA" stroke="#EAE3D2" strokeWidth="2" />
            <path d="M62 96 Q82 82 102 96" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Ripe Alphonso mango fan */}
            <ellipse cx="126" cy="94" rx="26" ry="15" transform="rotate(-35 126 94)" fill="#F3A723" />
            <ellipse cx="132" cy="105" rx="25" ry="14" transform="rotate(-15 132 105)" fill="#F9BD38" />
            <ellipse cx="128" cy="116" rx="23" ry="13" transform="rotate(8 128 116)" fill="#F59E1B" />
            {/* Sesame seeds */}
            <circle cx="78" cy="92" r="2" fill="#D4B475" />
            <circle cx="86" cy="98" r="2" fill="#D4B475" />
            <circle cx="74" cy="102" r="2" fill="#D4B475" />
          </svg>
        </div>
      );

    case 'cauliflower-herb-bowl':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#E6F3EE] via-[#F4F8F5] to-[#DCECE5] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="102" cy="105" r="74" fill="#C9D8D2" opacity="0.45" />
            <circle cx="100" cy="100" r="72" fill="#FFFFFF" stroke="#DDE7E2" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="60" fill="#F8FAF8" />
            {/* Cauliflower rice */}
            <circle cx="100" cy="100" r="36" fill="#F1EFE4" />
            <circle cx="86" cy="92" r="4" fill="#E3DEC8" />
            <circle cx="110" cy="88" r="4" fill="#E3DEC8" />
            <circle cx="96" cy="110" r="4.5" fill="#E3DEC8" />
            {/* Avocado fan */}
            <path d="M55 95 Q70 65 92 78 L80 105 Z" fill="#6AA84F" />
            <path d="M62 94 Q74 72 88 82 L80 102 Z" fill="#A6CE6C" />
            {/* Crispy tamari tofu */}
            <rect x="108" y="68" width="22" height="20" rx="5" transform="rotate(14 108 68)" fill="#B57B4C" />
            <rect x="112" y="102" width="22" height="20" rx="5" transform="rotate(-12 112 102)" fill="#9E6539" />
            {/* Greens */}
            <circle cx="76" cy="120" r="14" fill="#2A7A5E" />
            <circle cx="128" cy="94" r="11" fill="#3B9373" />
          </svg>
        </div>
      );

    case 'tandoori-paneer-salad':
    case 'protein-house-hero':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#F7ECE3] via-[#FAF6F0] to-[#E8F1EC] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="102" cy="105" r="74" fill="#D5CCC0" opacity="0.45" />
            <circle cx="100" cy="100" r="72" fill="#FFFFFF" stroke="#E6E0D4" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="60" fill="#F9F7F1" />
            {/* Greens bed */}
            <circle cx="82" cy="86" r="22" fill="#2D7E5D" />
            <circle cx="118" cy="114" r="22" fill="#246B4F" />
            <circle cx="116" cy="82" r="18" fill="#3A9670" />
            {/* Charred paneer cubes */}
            <rect x="68" y="74" width="24" height="22" rx="4" transform="rotate(-10 68 74)" fill="#F3D8A8" stroke="#C55F26" strokeWidth="2.5" />
            <rect x="104" y="88" width="24" height="22" rx="4" transform="rotate(12 104 88)" fill="#F5DFB7" stroke="#C55F26" strokeWidth="2.5" />
            <rect x="76" y="108" width="22" height="20" rx="4" transform="rotate(5 76 108)" fill="#F3D8A8" stroke="#C55F26" strokeWidth="2.5" />
            {/* Bell pepper strips */}
            <path d="M126 70 Q140 84 126 98" fill="none" stroke="#D14334" strokeWidth="5" strokeLinecap="round" />
            <path d="M58 106 Q54 124 70 132" fill="none" stroke="#E5A22E" strokeWidth="5" strokeLinecap="round" />
            {/* Mint chutney swirl */}
            <circle cx="130" cy="126" r="13" fill="#46A874" stroke="#E5F4EC" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'berry-chia-parfait':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#EFEAF5] via-[#FAF7F2] to-[#E6F1ED] flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="102" cy="105" r="74" fill="#D5CFDC" opacity="0.4" />
            <circle cx="100" cy="100" r="72" fill="#FFFFFF" stroke="#E8E2EC" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="56" fill="#EFEBE2" />
            {/* Blackberries & blueberries */}
            <circle cx="84" cy="84" r="10" fill="#3B234A" />
            <circle cx="104" cy="78" r="9" fill="#4C2E60" />
            <circle cx="118" cy="96" r="10" fill="#2E3D73" />
            <circle cx="88" cy="112" r="9" fill="#2E3D73" />
            {/* Chia specks & almonds */}
            <ellipse cx="106" cy="106" rx="9" ry="4" transform="rotate(-25 106 106)" fill="#D9B98A" />
            <ellipse cx="74" cy="100" rx="8" ry="4" transform="rotate(20 74 100)" fill="#D9B98A" />
            <circle cx="100" cy="94" r="2" fill="#5D5952" />
            <circle cx="112" cy="118" r="2" fill="#5D5952" />
            <circle cx="94" cy="124" r="2" fill="#5D5952" />
          </svg>
        </div>
      );
  }
};
