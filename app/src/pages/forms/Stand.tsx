// Created 1/31/25 5:00PM CST
// Author(s): math-rad
/*
Auto:
* Robot leaves: Check
* Coral:
    4 +-
    3
    2
    1
* Alge Score Adj.
    Net +-
    Processor

Teleop:
* Coral:
    4 +-
    3
    2
    1
* Alge Score Adj.
    Net +-
    Processor

Prompts:

* Floor:
    * Algae y/n
        * Processor
        * Net
Endgame:
* Park y/n
* Cages + pictures/diagram interface

Post Match:
* Floor pickup: Alg. | Coral
* defensive
* yes: -> good/bad defense w scale: 1-3
* defended against
* offensive
* yes -> good/bad offense w scale: 1-3
* Criticals
* comments
 */

// To use dynamic generation in the future


interface coral {
  total: number,
  level1: number,
  level2: number,
  level3: number,
  level4: number,
}
interface algae {
  total: number,
  processor: number,
  net: number
}

type caliber = "NA" | "trivial" | "exceptional" | number
type functionCaliber = caliber | "bare-minimum" | "fine" | "solid" | "great"
type combatCaliber = caliber | "trivial" | "weak" | "decent" | "strong" | "formidable"
interface formData {
  event: string | number,
  match: {
    auto: {
      leaves: boolean,
      coral: coral,
      algae: algae
    },
    teleop: {
      coral: coral,
      algae: algae
    }
    end: {
      doesPark: boolean
      cage: {
        type: 0 | 1 | 2, // 0 for NA
        succeeded: boolean,
        performance: functionCaliber
      },
    },
  },
  notes: {
    abilities: {
      floorPickup: {
        coral: boolean,
        algae: {
          processor: boolean,
          net: boolean
        }
      },
      robotEngagement: {
        offensive: boolean,
        offenseCaliber: combatCaliber,
        defensive: boolean,
        defenseCaliber: combatCaliber,
        targetRobot: true
      },
      criticals: string[], // to be defined more later
      comments: string
    }
  }
}