import {Alert, AlertDescription} from '#/components/ui/alert'

import {useFormContext} from './index'

export function FormError() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={state => state.errorMap.onSubmit}>
      {error => {
        if (!error) return null
        const message = error instanceof Error ? error.message : error

        return (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )
      }}
    </form.Subscribe>
  )
}
