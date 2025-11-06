// Helper para obtener el componente de icono por nombre
import { 
  Barbell, 
  PersonSimpleWalk, 
  PersonSimpleRun, 
  PersonSimpleBike, 
  PersonSimpleSwim, 
  PersonSimpleTaiChi, 
  Heartbeat, 
  Basketball, 
  Pulse, 
  PersonSimpleHike,
  BaseballHelmet,
  BeachBall,
  BowlingBall,
  BoxingGlove,
  Football,
  Horse,
  PersonSimpleSki,
  PersonSimpleSnowboard,
  PersonSimpleThrow,
  PingPong,
  SneakerMove,
  SoccerBall,
  TennisBall,
  Timer,
  Volleyball
} from '@phosphor-icons/react';

const iconMap: Record<string, any> = {
  Barbell,
  PersonSimpleWalk,
  PersonSimpleRun,
  PersonSimpleBike,
  PersonSimpleSwim,
  PersonSimpleTaiChi,
  Heartbeat,
  Basketball,
  Pulse,
  PersonSimpleHike,
  BaseballHelmet,
  BeachBall,
  BowlingBall,
  BoxingGlove,
  Football,
  Horse,
  PersonSimpleSki,
  PersonSimpleSnowboard,
  PersonSimpleThrow,
  PingPong,
  SneakerMove,
  SoccerBall,
  TennisBall,
  Timer,
  Volleyball,
};

export function getExerciseIcon(iconName: string | null | undefined) {
  if (!iconName) return Barbell; // Icono por defecto
  return iconMap[iconName] || Barbell;
}

