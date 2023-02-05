import '../Global.css'
import { useEffect, useState } from 'react';
import HeaderComponent from '../Components/Header';
import loginFormStyles from '../Styles/LoginFormStyles';
import { TextInput, TextInputProps, Notification, Text, useMantineTheme, Container, Title, Anchor, Paper, PasswordInput, Group, Checkbox, Button, Modal, Loader } from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft, IconX } from '@tabler/icons';
import config from '../../Constants';

import { useSignIn } from "react-auth-kit";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { UpdatedHeader } from '../Components/UpdatedHeader';
import { showNotification } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';

function LoginPage() {

    const [focused, setFocused] = useState(false);
    const [loginInputValue, setLoginInputValue] = useState('');
    const { classes } = loginFormStyles({ floating: loginInputValue.trim().length !== 0 || focused });
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const [error, setError] = useState(false);
    const [opened, setOpened] = useState(false)
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
            navigate("/");
        } catch (err) {
            setLoginInputValue("")
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        admin ? setUsername("Admin") : setUsername("7028")
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