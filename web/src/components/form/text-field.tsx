import {forwardRef} from 'react'

import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'
import {Input} from '#/components/ui/input'

import {useFieldContext, useFormContext} from './index'

interface TextFieldProps {
  label: string
  required?: boolean
  hideLabel?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
  type?: 'text' | 'email' | 'tel' | 'url'
  className?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {required, hideLabel, label, helpText, disabled, type = 'text', placeholder, className},
  ref
) {
  const field = useFieldContext<string>()
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
        type={type}
        name={field.name}
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasErrors}
        required={required}
      />
      {helpText && <FieldDescription>{helpText}</FieldDescription>}
      {hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
})
