import { Box,Text } from "@chakra-ui/react"
import { ChartClient } from "../components/Dashboard_Box/ChartClient"
import { BreadcrumbCustom } from "../components/Dashboard_Box/Breadcrumb"
import { BoxOne } from "../components/Dashboard_Box/Box1"
import { Calendar } from "../components/Dashboard_Box/Calendar"
import { useEffect, useState } from "react"
import GraphAPI from "../services/GraphAPI"
export function Homepage(){

  const [pourcentageAppointments, setPourcentageAppointments] = useState(0);
  const [pourcentageClients, setPourcentageClients] = useState(0);

  const fetchPourcentage = async() => {
    setPourcentageAppointments(await GraphAPI.getAppointmentsPourcentage());
    setPourcentageClients(await GraphAPI.getPatientsPourcentage());
  };

  useEffect(() =>{
    fetchPourcentage();
  }, [])

  useEffect(() => {
    console.log(pourcentageAppointments)
  }, [pourcentageAppointments])

    return(

      <>
        <Box display={'flex'} flexDirection={'column'} width={"100%"} minWidth={"840px"} gap={"20px"} marginInline={'10px'} marginBottom={"20px"}>
            <Box margin={"20px 0px 40px 0px"}>
              <BreadcrumbCustom/>
              <Text fontWeight={600}>Dashboard</Text>
            </Box>
    
            <Box display={'flex'} width={'100%'} justifyContent={'center'} gap={'20px'}>
              <BoxOne width={"33%"} height={'fit-content'} component={<ChartClient chartName={"Clients"} pourcentage={parseInt(pourcentageClients[0]?.Pourcentage) || 0} />}/>
              <BoxOne width={"33%"} height={'fit-content'} component={<ChartClient chartName={"Réservations"} pourcentage={parseInt(pourcentageAppointments[0]?.Pourcentage) || 0}/>}/>
              <BoxOne width={"33%"} height={'fit-content'} component={<ChartClient chartName={"Charges"} pourcentage={-10}/>}/>
            </Box>

              <BoxOne width={"100%"} component={<Calendar/>}/>
            
        </Box>

      </>
    )
}