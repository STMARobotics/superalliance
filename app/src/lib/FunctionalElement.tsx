import {
    createTheme,
    TextInput,
    NumberInput,
    Text,
    rem,
    rgba,
    Container,
    Title,
    InputDescription
} from '@mantine/core'

import {Minus, Plus} from 'lucide-react'

export type caliber = "NA" | "trivial" | "exceptional" | number | ""
export type functionCaliber = caliber | "bare-minimum" | "fine" | "solid" | "great"
export type combatCaliber = caliber | "trivial" | "weak" | "decent" | "strong" | "formidable"

interface functionalElementConstructor {
    title: string | undefined | null,
    description: string | undefined | null,
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
                fw={800}
                variant="gradient"
                gradient={{from: "white", to: rgba("#89c3ff", 1/2), deg: 20}}
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
                radius="sm"
                label={title}
                description={description}
                placeholder={placeholder}
            >
            </TextInput>
        </div>
    )
}

export function FormIncrementTable({title, fields}: {
    title: string,
    fields: [...([string, string] | string)]
}) {
    return (
        <div className="formIncrementTable">
            <Title size="2rem" className="formIncrementTableTitle" >{title}</Title>
            <div className="formIncrementTableContainer">
                {fields.map((data => (
                    <FormIncrementer description={data}/>
                )))}
            </div>
        </div>
    )
}

export function FormIncrementer({title, description}: {
    title: string | undefined,
    description: string | undefined
}) {
    return (
        <div className="formIncrementer">
            {description && <InputDescription>{description}</InputDescription>}
            <Plus
                className="formIncrementerPlus"
            />
            <NumberInput
                className="formIncrementerInput"
                size="lg"
                hideControls
            />
            <Minus
                className="formIncrementorMinus"
            />
        </div>
    )
}

export function FormIncrementable({title, description}: functionalElementConstructor) {
    return (
        <div className="formIncrementGeneralContainer">
            <Text>{title}</Text>
            <div className="formIncrementElementContainer">
                <Plus className="formIncrementPlus"/>
                <NumberInput description={description} hideControls></NumberInput>
                <Minus className="formIncrementMinus"/>
            </div>
        </div>
    )
}
