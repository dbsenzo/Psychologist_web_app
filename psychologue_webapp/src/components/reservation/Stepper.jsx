import { Stepper,Step, StepIndicator, StepStatus, Box, StepTitle, StepDescription, StepIcon, StepNumber, StepSeparator, useSteps } from "@chakra-ui/react"
import PropTypes from 'prop-types';

export function StepperComponent({step}){
  const steps = [
      { title: 'Premièrement', description: 'Informations de contacte' },
      { title: 'Deuxièmement', description: 'Rendez-vous' },
      { title: 'Troisièmement', description: 'Payement' },
    ]
  
    const { activeStep } = useSteps({
      index: step,
      count: steps.length,
    })
  
    return (
      <Stepper index={activeStep}color={'white'}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    )
  }
  
  StepperComponent.propTypes = {
    step: PropTypes.number.isRequired,
  };