import { Step, StepIconProps, StepLabel, Stepper, StepperProps } from '@mui/material'

interface Props extends StepperProps {
  steps: {
    label: string
    StepIconComponent?: React.ElementType<StepIconProps>
  }[]
}

export default function UiStepper({ steps, ...rest }: Props) {
  return (
    <Stepper {...rest} alternativeLabel>
      {steps.map(({ label, StepIconComponent }) => (
        <Step key={label}>
          <StepLabel StepIconComponent={StepIconComponent}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
