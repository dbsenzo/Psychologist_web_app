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
        <Box display={'flex'} flexDirection={'column'} width={"100%"} minWidth={"840px"} gap={"20px"} marginBottom={"20px"}>
            <Box margin={"20px 0px 40px 0px"}>
              <BreadcrumbCustom actualPage={"Accueil"}/>
              <Text fontWeight={600}>Dashboard</Text>
            </Box>
    
            <Box display={'flex'} flexDirection={'column'} width={"100%"} minWidth={"840px"} gap={"20px"} marginBottom={"20px"}>
              <Box display={'flex'} width={'100%'} justifyContent={'space-between'} gap={'10px'}>
                <Box flex={1} minW="0"> {/* Assurez-vous que les box peuvent rétrécir jusqu'à 0 */}
                  <BoxOne height={'fit-content'} component={<ChartClient chartName={"Clients"} pourcentage={parseInt(pourcentageClients[0]?.Pourcentage) || 0} />}/>
                </Box>
                <Box flex={1} minW="0">
                  <BoxOne height={'fit-content'} component={<ChartClient chartName={"Charges"} pourcentage={-10}/>}/>
                </Box>
                <Box flex={1} minW="0">
                  <BoxOne height={'fit-content'} component={<ChartClient chartName={"Réservations"} pourcentage={parseInt(pourcentageAppointments[0]?.Pourcentage) || 0}/>}/>
                </Box>
              </Box>
            </Box>


            <BoxOne width={"100%"} component={<Calendar clientId={null} addClient={true}/>}/>
            
        </Box>

      </>
    )
}