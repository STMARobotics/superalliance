import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRobotType(robotData: any) {
  if (robotData.coralBotPercentage === 0 && robotData.algaeBotPercentage === 0) {
    return ["None", ""]
  } else if (robotData.coralBotPercentage > 0 && robotData.algaeBotPercentage === 0) {
    return ["Coral Bot", "Met the requirements during " + robotData.coralBotPercentage + "% of matches"]
  } else if (robotData.coralBotPercentage === 0 && robotData.algaeBotPercentage > 0) {
    return ["Algae Bot", "Met the requirements during " + robotData.algaeBotPercentage + "% of matches"]
  } else {
    return ["Hybrid", ""]
  }
}