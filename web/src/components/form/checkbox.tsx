import {Checkbox} from '#/components/ui/checkbox'
import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'

import {useFieldContext, useFormContext} from './index'

interface CheckboxProps {
  label: string
  required?: boolean
  disabled?: boolean
  helpText?: string
  className?: string
}

export function CheckBox({label, required, disabled, helpText, className}: CheckboxProps) {
  const field = useFieldContext<boolean>()
  const form = useFormContext()
  const hasErrors = form.state.isSubmitted && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <div className="flex items-start gap-2">
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={checked => field.handleChange(checked === true)}
          onBlur={() => field.handleBlur()}
          disabled={disabled}
          aria-invalid={field.state.meta.errors.length > 0}
          required={required}
        />
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FieldLabel>
          {helpText && <FieldDescription>{helpText}</FieldDescription>}
          {hasErrors && <FieldError errors={field.state.meta.errors} />}
        </div>
      </div>
    </Field>
  )
}
