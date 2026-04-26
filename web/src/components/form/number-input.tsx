import {forwardRef} from 'react'

import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'
import {Input} from '#/components/ui/input'

import {useFieldContext, useFormContext} from './index'

interface NumberInputProps {
  label: string
  required?: boolean
  hideLabel?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
  min?: number
  max?: number
  step?: number
  className?: string
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {required, hideLabel, label, helpText, disabled, placeholder, min, max, step, className},
  ref
) {
  const field = useFieldContext<number | ''>()
  const form = useFormContext()
  const hasErrors = form.state.submissionAttempts > 0 && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <FieldLabel className={hideLabel ? 'sr-only' : undefined}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Input
        ref={ref}
        type="number"
        name={field.name}
        value={field.state.value === '' ? '' : String(field.state.value)}
        onChange={e => {
          const val = e.target.value
          field.handleChange(val === '' ? '' : Number(val))
        }}
        onBlur={() => field.handleBlur()}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasErrors}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {helpText && <FieldDescription>{helpText}</FieldDescription>}
      {hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
})
