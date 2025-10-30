'use client';

import { Card } from './Card';
import { Trophy, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    unlocked: boolean;
    unlockedAt?: string;
  };
  onUnlock?: () => void;
}

export function AchievementCard({ achievement, onUnlock }: AchievementCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (achievement.unlocked && !achievement.unlockedAt) {
      setAnimate(true);
      if (onUnlock) onUnlock();
    }
  }, [achievement.unlocked, achievement.unlockedAt, onUnlock]);

  return (
    <div className="relative">
      <Card 
        padding="md" 
        className={`transition-all duration-300 ${
          achievement.unlocked 
            ? 'border-2 border-[#5FB75D] bg-gradient-to-r from-green-50 to-white shadow-lg hover:shadow-xl' 
            : 'opacity-50 bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`relative transition-all duration-300 ${
            achievement.unlocked && animate
              ? 'animate-bounce scale-110'
              : ''
          }`}>
            {achievement.unlocked ? (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5FB75D] to-green-600 flex items-center justify-center text-white text-xl shadow-lg">
                {achievement.emoji}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
                {achievement.emoji}
              </div>
            )}
            
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.name}
              </p>
              {achievement.unlocked && (
                <Trophy className="w-4 h-4 text-yellow-500 animate-pulse" />
              )}
            </div>
            <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {achievement.description}
            </p>
            {achievement.unlockedAt && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Desbloqueado
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Explosión de confeti para nuevo logro */}
      {achievement.unlocked && animate && !achievement.unlockedAt && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-[#5FB75D] opacity-75"></div>
            <div className="relative inline-flex rounded-full h-16 w-16 bg-[#5FB75D]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

