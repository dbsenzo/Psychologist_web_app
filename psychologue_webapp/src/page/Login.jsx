import { Box, Button, Input, Text, Image, Switch } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const nav = useNavigate()

    const handleLogin = (event) => {
        event.preventDefault();
        // LoginAPI.signup(username, password);
        login(username, password)
    }
  
    useEffect(() => {
      if (user) {
        const destination = user.isAdmin ? '/' : '/account/viewAppointment';
        nav(destination);
      }
    }, [user, nav]);


    return(
        <>
            <Box as="div" position={"absolute"} zIndex={-1} width={{base: "unset", md: '100vw'}} height={"100vh"}>
                <Image boxSize={"100%"} src={"/backgroundLogin.svg"} alt={'login_background'} objectFit={"cover"}/>
            </Box>
            <Box as='div' display={'flex'} flexDirection={'column'} height={"100vh"} justifyContent={'center'}>
                <Box display={'flex'} width={'100%'} height={'fit-content'} justifyContent={'center'}>
                    <Box width={{base: "80%", sm: "60%", md: "40%"}} display={"flex"} flexDirection={'column'} padding={"30px"} height={"100%"} backgroundColor={"#F8F9FA"} borderRadius={"12px"} gap={{base: "30px", md: "50px"}} boxShadow={"0px 5px 3.5px 0px rgba(0, 0, 0, 0.1)"}>
                        <Box display={"flex"} flexDirection={"column"}>
                            <Text textTransform={"uppercase"} fontSize={"32px"} fontWeight={700} color={'rgba(0, 0, 0, 0.77)'}>Connexion</Text>
                            <Text fontSize={"16px"} fontWeight={500} color={'rgba(0, 0, 0, 0.57)'}>Entrer dans l&apos;univers de la psychologie</Text>
                        </Box>
                        <form style={{gap: '10px', display: 'flex', flexDirection: 'column'}}onSubmit={handleLogin}>
                            <Box display={"flex"} flexDirection={"column"} gap={"30px"}>
                                <Box>
                                    <Text fontWeight={500}>Nom d'utilisateur</Text>
                                    <Input placeholder="Votre nom d'utilisateur" onChange={e => setUsername(e.target.value)}/>
                                </Box>
                                <Box>
                                    <Text fontWeight={500}>Mot de passe</Text>
                                    <Input placeholder="Votre mot de passe" type="password" onChange={e => setPassword(e.target.value)}/>
                                    {/* <FormHelperText>Nous ne savons rien de votre mot de passe.</FormHelperText> */}
                                </Box>
                                

                            </Box>
                            <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
                                <Box display={"flex"} textAlign={'end'} alignItems={'center'} gap={'7px'}>
                                    <Switch color={"green"}/>
                                    <Text fontSize={"16px"}>Se souvenir de moi</Text>
                                </Box>
                                <Button variant={"secondary"} type="submit">Connexion</Button>
                                {/* <Text>Acceder au meilleur dashboard ? <Text as={'span'} variant="hoverBlue" color="textColor">Inscription</Text></Text> */}
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    )
}