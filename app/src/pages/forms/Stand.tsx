// eslint-disable-next-line @typescript-eslint/no-unused-vars


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

import '../../aesthetics.css'

import {
    Group,
    ActionIcon,
    MantineProvider,
    createTheme,
    TextInput,
    NumberInput,
    Text,
    rem,
    rgba
} from '@mantine/core'
import {
    IconMinus,
    IconPlus,
} from '@tabler/icons-react'
import {useForm} from "@mantine/form"


const CoreFormTheme = createTheme({
    fontSizes: {
        leadTitle: rem(40),
        sectionTitle: rem(35),
        fieldTitle: rem(18),
        fieldDescription: rem(12)
    },

})


// Form data structure
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

type caliber = "NA" | "trivial" | "exceptional" | number | ""
type functionCaliber = caliber | "bare-minimum" | "fine" | "solid" | "great"
type combatCaliber = caliber | "trivial" | "weak" | "decent" | "strong" | "formidable"

const criticals = [
    "died",
    "tipped",
    "red card",
    "mechanism broke",
    "bumper malfunction"
]
interface formData {
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

// Define functional templates

interface functionalElementConstructor {
    title: string | undefined,
    description: string | undefined,
    reaction: (() => void) | undefined,
    link: {
        ref: object,
        index: string
    } | undefined
}

interface TextInputElement extends functionalElementConstructor {
    placeholder: string
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Incrementor = (properties: functionalElementConstructor) => {

}

function FormTitle({title}: {title: string}) {
    return (
        <Text
            size="leadTitle"
            fw={900}
            variant="gradient"
            gradient={{from: "grape", to: "indigo", deg: 20}}
        >
            {title}
        </Text>
    )
}

function FormSection({title, children}: {title: string, children: React.ReactNode}) {
    return (
        <div>
            <Text
                className="formSectionTitle"
                size="sectionTitle"
                fw={600}
                variant="gradient"
                gradient={{from: "white", to: rgba("#b3e0ff", 0), deg: 20}}
            >
                {title}
            </Text>
            <div className="formSectionContainer">
                {children}
            </div>

        </div>

    )
}

function FormTextInput({title, description, placeholder, link}: TextInputElement) {
    return (
        <div className="formField">
            <TextInput
                styles={{
                    input: {backgroundColor: "#2b2b2b", color: "white"},
                }}
                label={title}
                description={description}
                placeholder={placeholder}
            >
            </TextInput>
        </div>
    )
}

function FormIncrementable({title, description}: functionalElementConstructor) {
    return (
        <div>
            <NumberInput
                label={title}
                description={description}
                placeholder="0"
                min={0}
                styles ={{
                    input: {backgroundColor: "#2b2b2b", color: "white"},
                }}
            />
        </div>
    )
}
export default function StandForm() {
    const formData = useForm<FormData>({
        initialValues: {
            values: {
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
                        }
                    },
                    postMatch: {
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
        }
    })

    return (
        <MantineProvider theme={CoreFormTheme}>
            <div className="formContainer">
                <FormTitle title="Stand Scouting Form" />
                <FormSection title="Section">
                    <FormTextInput title="Title" description="Description" placeholder="Placeholder"/>
                    <FormIncrementable title="Incrementable" description="Description"/>
                </FormSection>
            </div>
        </MantineProvider>
    )

}
