import '../Global.css'
import { useEffect, useState } from 'react';
import HeaderComponent from '../Components/Header';
import loginFormStyles from '../Styles/LoginFormStyles';
import { TextInput, TextInputProps, Notification, Text, useMantineTheme, Container, Title, Anchor, Paper, PasswordInput, Group, Checkbox, Button, Modal, Loader, Dialog } from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft, IconX } from '@tabler/icons';
import { config } from '../../Constants';

import { useSignIn } from "react-auth-kit";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UpdatedHeader } from '../Components/UpdatedHeader';
import { useLocalStorage } from '@mantine/hooks';

function LoginPage() {

    const test = useParams()
    
    useEffect(() => {
        console.log(test)
    }, [])

    const [loginInputValue, setLoginInputValue] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [opened, setOpened] = useState(false);
    const [cookiesOpened, setCookiesOpened] = useLocalStorage<boolean>({
        key: 'saved-cookies-accept',
        defaultValue: true
    });
    const [admin, setAdmin] = useLocalStorage<boolean>({
        key: 'saved-loginuser',
        defaultValue: false
    });
    const [username, setUsername] = useState("7028")
    const [loading, setLoading] = useState(false)
    const signIn = useSignIn();

    const onSubmit = async (values: any) => {
        try {

            setLoading(true)
            setError(false)

            const response = await axios.post(
                config.api_url + "/api/v1/login",
                values
            );

            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { user: values.user },
            });

            setLoading(false)
            navigate('/landing')
        } catch (err) {
            setLoginInputValue("")
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        admin ? setUsername("7028Admin") : setUsername("7028")
    }, [admin])

    const handleKeyPress = (event: any) => {
        if (event.key == "Enter") return onSubmit({
            user: username,
            password: loginInputValue
        })
    }

    function handleLoginInputChange(loginValue: string) {
        setLoginInputValue(loginValue)
    }

    return (
        <div className="App">

            <UpdatedHeader />

            <Dialog
                opened={cookiesOpened}
                onClose={() => setCookiesOpened(false)}
                size="md"
                withBorder
                p="xl"
                radius="md"
                shadow="md"
            >
                <Group position="apart" mb="xs">
                    <Text size="md" weight={500}>
                        This website uses cookies...
                    </Text>
                </Group>
                <Text color="dimmed" size="xs">
                    So here's the deal, we want to spy on you. We want like to know what you had for breakfast
                    today, where you live, how much do you earn and like 50 other things. To view SuperAlliance
                    you will have to accept all cookies. That&apos;s all, and remember that we are always
                    watching...
                </Text>
                <Group position="right" mt="xs">
                    <Button variant="outline" size="xs" onClick={() => setCookiesOpened(false)}>
                        Accept all
                    </Button>
                </Group>
            </Dialog>

            <div className="App-main">

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Forgot Password?"
                >
                    <h2>
                        Please contact your <strong>Coach</strong> or <strong>Mentor</strong> for your team's password.
                    </h2>
                </Modal>

                <div className="LoginForm">

                    {loading
                        ?
                        <Loader color="violet" />
                        :
                        <Container size={420} my={40}>

                            <Title
                                align="center"
                                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                                color={"#0066b3"}
                            >
                                Recon Login
                            </Title>
                            <Text color="dimmed" size="sm" align="center" mt={5}>
                                Don't know your password?{' '}
                                <Anchor<'a'> href="#" size="sm" onClick={(event) => {
                                    event.preventDefault()
                                    setOpened(true)
                                }}>
                                    Recover password
                                </Anchor>
                            </Text>

                            {error ? <Notification icon={<IconX size={18} />} color="red" mt={20} disallowClose>
                                Password Incorrect!
                            </Notification> : null}

                            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                                <TextInput label="Username" value={username} required disabled />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    required
                                    mt="md"
                                    value={loginInputValue}
                                    onChange={(event) => {
                                        handleLoginInputChange(event.currentTarget.value)
                                    }}
                                    onKeyDown={(event: any) => {
                                        handleKeyPress(event)
                                    }}
                                />
                                <Group position="apart" mt="lg">
                                    <Checkbox label="Admin?" sx={{ lineHeight: 1 }} checked={admin} onChange={(event) => setAdmin(event.currentTarget.checked)} />
                                </Group>
                                <Button
                                    fullWidth
                                    mt="xl"
                                    onClick={() => {
                                        onSubmit({
                                            user: username,
                                            password: loginInputValue
                                        })
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Paper>
                        </Container>
                    }
                </div>
            </div>
        </div>
    );
}

export default LoginPage;