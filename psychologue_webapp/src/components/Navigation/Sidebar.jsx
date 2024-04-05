import React from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import { Li } from './Li';

export function Sidebar() {
    return (
        <Box as='div' marginInline={'20px'} marginTop={'40px'} minWidth={'150px'}>
            <Box as='div' display={'flex'} gap={"20px"} flexDirection={"column"}>
                <Text fontSize={'x-large'} color={"2D3748"} fontWeight={600}>LOGO</Text>
                <Divider/>
                <Text fontSize={"large"} color={"2D3748"} fontWeight={500}>Sidebar</Text>
                <Box as="ul" display={"flex"} gap={"10px"} flexDirection={"column"}>
                    <Li text={"Home"} image={"/stats.svg"}/>
                    <Li text={"Home"} image={"/options.svg"}/>
                    <Li text={"Home"} image={"/appointment.svg"}/>
                </Box>
                <Text fontSize={"large"} color={"2D3748"} fontWeight={500}>Sidebar</Text>
                <Box as="ul" display={"flex"} gap={"10px"} flexDirection={"column"}>
                    <Li text={"Home"} image={"/stats.svg"}/>
                    <Li text={"Home"} image={"/options.svg"}/>
                    <Li text={"Home"} image={"/appointment.svg"}/>
                </Box>
            </Box>
            
        </Box>
    );
}