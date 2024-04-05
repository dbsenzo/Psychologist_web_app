import { Box, Image, Text } from '@chakra-ui/react';
import PropTypes from "prop-types";

export function Li({text, image}) {
    return (
        <Box as='div' display={'flex'} gap={'10px'} width={"80%"} >
            <Image src={image} color={"#4FD1C5"} background={"white"} borderRadius={"12px"} padding={'5px'}/>
            <Text color={"#A0AEC0"} fontWeight={500}>{text}</Text>
        </Box>
    );
}

Li.propTypes = {
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
}