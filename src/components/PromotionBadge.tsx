import { PromotionTier } from '../types';
import { Crown, Award, Star } from 'lucide-react';

interface PromotionBadgeProps {
  tier: PromotionTier;
}

export function PromotionBadge({ tier }: PromotionBadgeProps) {
  if (tier === 'none') return null;

  const config = {
    premium: {
      icon: Crown,
      text: 'Premium',
      bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white',
    },
    gold: {
      icon: Award,
      text: 'Gold',
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      textColor: 'text-white',
    },
    silver: {
      icon: Star,
      text: 'Silver',
      bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
      textColor: 'text-white',
    },
  };

  const { icon: Icon, text, bg, textColor } = config[tier];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${bg} ${textColor} text-xs font-semibold shadow-lg`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );
}
