import {FieldError as FieldErrorPrimitive} from '#/components/ui/field'

import {useFieldContext, useFormContext} from './index'

export function FieldError() {
  const field = useFieldContext()
  const form = useFormContext()
  const hasErrors = form.state.isSubmitted && field.state.meta.errors.length > 0

  if (!hasErrors) return null

  return <FieldErrorPrimitive errors={field.state.meta.errors} />
}
