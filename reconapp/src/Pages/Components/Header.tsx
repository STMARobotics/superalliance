import { ActionIcon, useMantineColorScheme, Text } from '@mantine/core';
import { IconSun, IconMoonStars, IconLogout, IconHome, IconForms, IconDashboard } from '@tabler/icons';
import { useSignOut } from "react-auth-kit";
import { useNavigate, useLocation } from "react-router-dom";
import '../Global.css'
import { useState } from 'react';
import EpicCoolThing from '../Modules/QuickAccess';

export default function HeaderComponent() {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    var isOnLoginPage = false;

    const singOut = useSignOut();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname == "/login") isOnLoginPage = true;

    const logout = () => {
        singOut();
        navigate("/login");
    };

    return (
        <div className="HeadingContainer">
            <Text
                color="#0066b3"
                ta="center"
                fz="xl"
                fw={700}
            >
                <a href='/'>ReconPlane</a>
            </Text>

            <div className="ActionIconGroup">
                <ActionIcon
                    variant="outline"
                    color={dark ? 'white' : 'black'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                    className='HeaderActionIcon'
                >
                    {dark ? <IconSun size={24} /> : <IconMoonStars size={24} />}
                </ActionIcon>
                {isOnLoginPage ? null : <ActionIcon
                    variant="outline"
                    color={dark ? 'white' : 'black'}
                    title="Logout"
                    className='HeaderActionIcon'
                    onClick={logout}
                >
                    {<IconLogout size={24} />}
                </ActionIcon>}
            </div>
        </div>
    )
}