import { Button,Box,Text } from "@chakra-ui/react";



export function Header(){
    return(
        <Box height='100px' background='#2B2B2B' display='flex' width='100vw'flexDirection={"column"} justifyContent={'center'} >
            <Box display={"flex"} justifyContent={'space-between'} width={"100%"} paddingInline={"50px"}>
                <Text fontSize='24px' color='white' fontWeight='600'>Psychologue</Text>
                <Button variant={'main'}>Connexion</Button>
            </Box>
        </Box>
    )
}