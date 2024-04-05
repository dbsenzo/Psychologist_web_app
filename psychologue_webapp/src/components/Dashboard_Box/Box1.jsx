import { Box } from "@chakra-ui/react"
export function BoxOne({width, height="unset", background="white", component}){
    
    return(
        <Box width={width} height={height} background={background} padding={"20px"} borderRadius={"20px"} boxShadow={"0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)"}>
            {component}
        </Box>
    )
}