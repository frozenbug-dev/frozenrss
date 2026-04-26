import {Alert, AlertDescription} from '#/components/ui/alert'

import {useFormContext} from './index'

export function FormError() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={state => state.errorMap.onSubmit}>
      {error => {
        if (!error) return null
        let message = error instanceof Error ? error.message : undefined
        if (!message && typeof error === 'object') message = error.message
        else if (!message && typeof error === 'string') message = error
        else message = 'Could not submit the data.'

        return (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )
      }}
    </form.Subscribe>
  )
}
