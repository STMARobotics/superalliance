import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { IconCircleNumber1 } from "@tabler/icons";
import { useState } from "react";

interface QuickTeamSearchProps {
    enabled: boolean;
    toggleEnabled: any;
}

function QuickTeamSearch({ enabled, toggleEnabled }: QuickTeamSearchProps) {

    const focusTrapRef = useFocusTrap();
    const [searchbyteamnum, setSearchbyteamnum] = useState('')

    return (
        <Modal transition={'rotate-left'} centered zIndex={10001} opened={enabled} onClose={() => toggleEnabled()} title="Search by Team Number">
            <Stack ref={focusTrapRef} spacing="lg">
                <TextInput
                    data-autofocus
                    icon={<IconCircleNumber1 />}
                    placeholder="Team Number"
                    value={searchbyteamnum}
                    onChange={(event) => {
                        setSearchbyteamnum(event.currentTarget.value)
                    }}
                    onKeyDown={(event) => {
                        if (event.code !== 'Enter') return
                        window.open(`/submissions/teams/${searchbyteamnum}`)
                        toggleEnabled()
                        setSearchbyteamnum('')
                    }}
                />

                <Button variant='outline' component='a' href={`/submissions/teams/${searchbyteamnum}`} target={'_blank'}>
                    View Forms
                </Button>
            </Stack>
        </Modal>
    )
}

export default QuickTeamSearch