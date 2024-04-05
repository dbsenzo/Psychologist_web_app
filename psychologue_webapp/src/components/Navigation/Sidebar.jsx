import { Box, Divider, Text, Image } from '@chakra-ui/react';
import { Li } from './Li';

export function Sidebar() {
    return (
        <Box as='div' marginInline={'20px'} marginTop={'40px'} width={'250px'}>
            <Box as='div' display={'flex'} gap={"20px"} flexDirection={"column"}>
                <Box as='div' display={'flex'} marginLeft={"10px"}>
                    <Image src='/logo.png' alt='Logo' width={"64px"} textAlign={"center"}/>
                    <Text fontSize={'medium'} color={"2D3748"} fontWeight={700}>PSYCHOLOGUIST DASHBOARD</Text>
                </Box>
                <Divider/>
                <Text fontSize={"x-large"} color={"2D3748"} fontWeight={500}>Navigation</Text>
                <Box as="ul" display={"flex"} gap={"20px"} flexDirection={"column"}>
                    <Li text={"Accueil"} image={"/stats.svg"} to={"/"}/>
                    <Li text={"Rendez-vous"} image={"/options.svg"} />
                    <Li text={"Patients"} image={"/appointment.svg"} to={'/reservation'}/>
                </Box>
            </Box>
            
        </Box>
    );
}