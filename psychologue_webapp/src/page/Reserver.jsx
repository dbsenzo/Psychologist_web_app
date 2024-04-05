import { useState } from "react";
import { StepperComponent } from "../components/reservation/Stepper";
import { ReserverCreneau } from "../components/reservation/ReseverCreneau";
import { Box } from "@chakra-ui/react";
import { InformationsPersonnel } from "../components/reservation/InformationsPersonnel";

export function Reserver() {
    // Création d'un état pour stocker les créneaux disponibles
    const [step, setStep] = useState(1);

    const displayStep = (step) => {
        switch (step){
            case 1:
                return <InformationsPersonnel step={step} setStep={setStep}/>
            case 2:
                return <ReserverCreneau setStep={setStep} step={step}/>
            case 3:
                return //

        }
    }

    
    return (
        <>
            <Box display={'flex'} justifyContent={'center'}>
                    <Box width={'80%'} display={'flex'} flexDirection={'column'} gap={'50px'}>
                        <StepperComponent step={step}/>
                        {displayStep(step)}
                    </Box>
            </Box>
        </>
    );
}
