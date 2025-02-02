// Created 1/31/25 5:00PM CST
// Author(s): math-rad
// To use dynamic generation in the future

import '@/aesthetics.css'
import {FormTitle, FormSection, FormTextInput, FormIncrementable, CoreFormTheme} from '@/lib/FunctionalElement'
import {getForm} from '@/form-schemes/Stand.ts'

import {useState} from "react";

import {Container, MantineProvider} from '@mantine/core'

const criticals = [
    "died",
    "tipped",
    "red card",
    "mechanism broke",
    "bumper malfunction"
]

// Define functional templates

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StandForm() {
    // @ts-ignore
    const form = getForm()

    return (
        <MantineProvider theme={CoreFormTheme}>
            <div className="formContainer">
                <FormTitle title="Stand Scouting Form"/>
                <FormSection title="Section">
                    <FormTextInput title="Name"/>
                    <Container className="massIncrementContainer">
                        <FormIncrementable title="Coral" description="Level 1"/>
                        <FormIncrementable title="Coral" description="Level 2"/>
                        <FormIncrementable title="Coral" description="Level 3"/>
                        <FormIncrementable title="Coral" description="Level 4"/>
                    </Container>

                </FormSection>
            </div>
        </MantineProvider>
    )
}
