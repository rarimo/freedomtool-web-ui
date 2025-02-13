import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material'
import { ChangeEvent, forwardRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Props extends RadioGroupProps {
  groupLabel?: string
  groupOptions: Omit<FormControlLabelProps, 'control'>[]
  updateValue: (value: string) => void
}

const UiRadioGroup = forwardRef(
  ({ groupLabel, groupOptions, updateValue, ...rest }: Props, ref) => {
    const id = useMemo(() => rest.id ?? `ui-radio-group-${uuidv4()}`, [rest.id])

    const handleChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
      updateValue?.(e.target.value)

      rest?.onChange?.(e, value)
    }

    return (
      <FormControl>
        {groupLabel && <FormLabel id={id}>{groupLabel}</FormLabel>}

        <RadioGroup {...rest} aria-labelledby={id} onChange={handleChange}>
          {groupOptions.map(({ value, label, ...elRest }, idx) => (
            <FormControlLabel
              {...elRest}
              inputRef={ref}
              key={idx}
              value={value}
              control={<Radio />}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )
  },
)

export default UiRadioGroup
