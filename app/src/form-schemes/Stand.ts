import { useForm } from "react-hook-form"

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

export type caliber = "NA" | "trivial" | "exceptional" | number | ""
export type functionCaliber = caliber | "bare-minimum" | "fine" | "solid" | "great"
export type combatCaliber = caliber | "trivial" | "weak" | "decent" | "strong" | "formidable"


export interface formData {
    event: string,
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
                type: number
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

const defaultFormData = {
    event: "",
    match: {
        auto: {
            leaves: false,
            algae: {
                total: 0,
                processor: 0,
                net: 0,
            },
            coral: {
                total: 0,
                level1: 0,
                level2: 0,
                level3: 0,
                level4: 0,
            }
        },
        teleop: {
            algae: {
                total: 0,
                processor: 0,
                net: 0,
            },
            coral: {
                total: 0,
                level1: 0,
                level2: 0,
                level3: 0,
                level4: 0,
            }
        },
        end: {
            doesPark: false,
            cage: {
                type: 0,
                succeeded: false,
                performance: "NA"
            }
        },
    },

    notes: {
        abilities: {
            floorPickup: {
                coral: false,
                algae: {
                    processor: false,
                    net: false
                }
            },
            robotEngagement: {
                offensive: false,
                defensive: false,
                targetRobot: false,
                offenseCaliber: "NA",
                defenseCaliber: "NA"
            }
        }
    }

}

export function getForm() {
    // @ts-ignore
    return useForm<formData>(defaultFormData)
}

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