import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'
import {Switch as SwitchPrimitive} from '#/components/ui/switch'

import {useFieldContext, useFormContext} from './index'

interface SwitchProps {
  label: string
  required?: boolean
  disabled?: boolean
  helpText?: string
  className?: string
}

export function Switch({label, required, disabled, helpText, className}: SwitchProps) {
  const field = useFieldContext<boolean>()
  const form = useFormContext()
  const hasErrors = form.state.submissionAttempts > 0 && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <div className="flex items-start gap-2">
        <SwitchPrimitive
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={checked => field.handleChange(checked === true)}
          onBlur={() => field.handleBlur()}
          disabled={disabled}
          aria-invalid={hasErrors}
          required={required}
        />
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {helpText && <FieldDescription>{helpText}</FieldDescription>}
          {hasErrors && <FieldError errors={field.state.meta.errors} />}
        </div>
      </div>
    </Field>
  )
}
