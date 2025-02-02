import {
    createTheme,
    TextInput,
    NumberInput,
    Text,
    rem,
    rgba,
    Container
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
        fieldDescription: rem(20)
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
            <Container className="formSectionContainer">
                {children}
            </Container>
        </div>

    )
}

export function FormTextInput({title, description, placeholder}: TextInputElement) {
    return (
        <div className="formFieldText">
            <TextInput
                styles={{
                    input: {backgroundColor: "#2b2b2b", color: "white"},
                }}
                variant="filled"
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
                className="formFieldIncrement"
                styles={{
                    input: {backgroundColor: "#2b2b2b", color: "white", width: "45%", transform: "translateX(65%)"},
                }}
                variant="filled"
                label={title}
                description={description}
                min={0}
                max={99}
                allowDecimal={false}
                allowNegative={false}
                hideControls
            >
            </NumberInput>
        </div>
    )
}

