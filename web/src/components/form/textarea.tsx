import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'
import {Textarea as TextareaPrimitive} from '#/components/ui/textarea'

import {useFieldContext, useFormContext} from './index'

interface TextareaProps {
  label: string
  required?: boolean
  hideLabel?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
  rows?: number
  className?: string
}

export function Textarea({
  required,
  hideLabel,
  label,
  helpText,
  disabled,
  placeholder,
  rows = 3,
  className,
}: TextareaProps) {
  const field = useFieldContext<string>()
  const form = useFormContext()
  const hasErrors = form.state.submissionAttempts > 0 && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <FieldLabel className={hideLabel ? 'sr-only' : undefined}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <TextareaPrimitive
        name={field.name}
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasErrors}
        required={required}
        rows={rows}
      />
      {helpText && <FieldDescription>{helpText}</FieldDescription>}
      {hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
