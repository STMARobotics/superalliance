import HeaderComponent from "../Components/Header"
import { Anchor, Breadcrumbs, Button, Text, useMantineTheme } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { IconClick, IconForms } from "@tabler/icons";
import { UpdatedHeader } from "../Components/UpdatedHeader";
import { useLocalStorage } from "@mantine/hooks";

function FormSubmitted() {

    const navigate = useNavigate()
    const theme = useMantineTheme()

    const [selectedUser, setSelectedUser] = useLocalStorage<any>({
        key: 'saved-username',
        getInitialValueInEffect: false,
    });

    const items = [
        { title: 'Home', href: '/' },
        { title: 'Form Submitted', href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (

        <div className="App">

            <UpdatedHeader />

            <div className="App-main">

                <>
                    <Breadcrumbs>{items}</Breadcrumbs>
                </>

                <div className="FormSubmittedContainer">

                    <Text
                        className="FormSubmittedText"
                        color={theme.primaryColor}
                        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Form Submitted!
                    </Text>

                    <Button
                        variant="outline"
                        rightIcon={
                            <IconForms size={20} stroke={1.5} />
                        }
                        size="md"
                        styles={{
                            root: { paddingRight: 14, height: 48 },
                        }}
                        onClick={() => {
                            navigate(`/submissions/user/${(selectedUser).replace(" ", "+")}`)
                        }}
                    >
                        View all of your submissions!
                    </Button>

                    <Button
                        variant="light"
                        rightIcon={
                            <IconClick size={20} stroke={1.5} />
                        }
                        radius="xl"
                        size="md"
                        styles={{
                            root: { paddingRight: 14, height: 48 },
                        }}
                        onClick={() => {
                            navigate('/')
                        }}
                    >
                        Home
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default FormSubmitted