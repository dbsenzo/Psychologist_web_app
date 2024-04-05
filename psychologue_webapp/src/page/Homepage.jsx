import { Box,Text } from "@chakra-ui/react"
import { ChartClient } from "../components/Dashboard_Box/ChartClient"
import { BreadcrumbCustom } from "../components/Dashboard_Box/Breadcrumb"
import { BoxOne } from "../components/Dashboard_Box/Box1"
import { Calendar } from "../components/Dashboard_Box/Calendar"
export function Homepage(){

    return(
      <>
        <Box display={'flex'} flexDirection={'column'} width={"100%"} minWidth={"840px"} gap={"20px"} marginInline={'10px'} marginBottom={"20px"}>
            <Box margin={"20px 0px 40px 0px"}>
              <BreadcrumbCustom/>
              <Text fontWeight={600}>Dashboard</Text>
            </Box>
    
            <Box display={'flex'} width={'100%'} justifyContent={'center'} gap={'20px'}>
              <Box background={'white'} padding={"10px"} borderRadius={"20px"} minWidth={"270px"} width={"33%"} height={'fit-content'} boxShadow={"0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)"}>
                <ChartClient chartName={"Clients"} pourcentage={5} />
              </Box>
              <Box background={'white'} padding={"10px"} borderRadius={"20px"} minWidth={"270px"} width={"33%"} height={'fit-content'} boxShadow={"0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)"}>
                <ChartClient chartName={"Réservations"} pourcentage={25}/>
              </Box>
              <Box background={'white'} padding={"10px"} borderRadius={"20px"} minWidth={"270px"} width={"33%"} height={'fit-content'} boxShadow={"0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)"}>
                <ChartClient chartName={"Charges"} pourcentage={-10}/>
              </Box>
            </Box>

              <BoxOne width={"100%"} component={<Calendar/>}/>
            
        </Box>

      </>
    )
}