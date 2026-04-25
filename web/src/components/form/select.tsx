import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'

import {useFieldContext, useFormContext} from './index'

interface SelectItem {
  id: string
  label: string
}

interface SelectProps {
  label: string
  items: SelectItem[]
  placeholder?: string
  required?: boolean
  hideLabel?: boolean
  disabled?: boolean
  helpText?: string
  className?: string
}

export function Select({label, items, placeholder, required, hideLabel, disabled, helpText, className}: SelectProps) {
  const field = useFieldContext<string>()
  const form = useFormContext()
  const hasErrors = form.state.isSubmitted && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <FieldLabel className={hideLabel ? 'sr-only' : undefined}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <SelectPrimitive
        value={field.state.value || undefined}
        onValueChange={(value: string | null) => field.handleChange(value || '')}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger aria-invalid={field.state.meta.errors.length > 0}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map(item => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>
      {helpText && <FieldDescription>{helpText}</FieldDescription>}
      {hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
