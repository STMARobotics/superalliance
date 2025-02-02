import {
    createTheme,
    TextInput,
    NumberInput,
    Text,
    rem,
    rgba
} from '@mantine/core'

export type caliber = "NA" | "trivial" | "exceptional" | number | ""
export type functionCaliber = caliber | "bare-minimum" | "fine" | "solid" | "great"
export type combatCaliber = caliber | "trivial" | "weak" | "decent" | "strong" | "formidable"

interface functionalElementConstructor {
    title: string | undefined,
    description: string | undefined,
}

interface TextInputElement extends functionalElementConstructor {
    placeholder: string
}
export const CoreFormTheme = createTheme({
    fontSizes: {
        leadTitle: rem(40),
        sectionTitle: rem(35),
        fieldTitle: rem(18),
        fieldDescription: rem(12)
    },

})

export function FormTitle({title}: { title: string }) {
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

export function FormSection({title, children}: { title: string, children: React.ReactNode }) {
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
export function FormTextInput({title, description, placeholder}: TextInputElement) {
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

export function FormIncrementable({title, description}: functionalElementConstructor) {
    return (
        <div>
            <NumberInput
                label={title}
                description={description}
                placeholder="0"
                min={0}
                styles={{
                    input: {backgroundColor: "#2b2b2b", color: "white"},
                }}
            />
        </div>
    )
}