import {Button} from '#/components/ui/button'

import {useFormContext} from './index'

interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'type'> {
  children: React.ReactNode
}

export function SubmitButton({children, ...props}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => (
        <Button type="submit" disabled={isSubmitting} {...props}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}
