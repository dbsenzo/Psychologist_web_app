import { Box, Divider, Text, Image, Button } from '@chakra-ui/react';
import { Li } from './Li';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function Sidebar() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    }

    return (
        <Box as='div' marginInline={'20px'} marginTop={'40px'} width={'250px'} height={'-webkit-fill-available'}>
            <Box as='div' display={'flex'} gap={"20px"} flexDirection={"column"} height={'100%'}>
                <Box as='div' display={'flex'} marginLeft={"10px"}>
                    <Image src='/logo.png' alt='Logo' width={"64px"} textAlign={"center"}/>
                    <Text fontSize={'medium'} color={"2D3748"} fontWeight={700}>PSYCHOLOGUIST DASHBOARD</Text>
                </Box>
                <Divider/>
                <Text fontSize={"x-large"} color={"2D3748"} fontWeight={500}>Navigation</Text>
                <Box as="ul" display={"flex"} gap={"20px"} flexDirection={"column"}>
                    <Li text={"Accueil"} image={"/stats.svg"} to={"/"}/>
                    <Li text={"Rendez-vous"} image={"/options.svg"} to={'/manageAppointments'} />
                    <Li text={"Patients"} image={"/appointment.svg"} to={'/reservation'}/>
                </Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'end'} pb={'5px'} height={'100%'}>
                    <Box textAlign={'center'}>
                        <Button variant="ghost" onClick={handleLogout}>Déconnexion</Button>
                    </Box>
                </Box>
            </Box>  
        </Box>
    );
}