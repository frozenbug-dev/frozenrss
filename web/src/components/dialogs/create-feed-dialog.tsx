import {useMutation, useQueryClient} from '@tanstack/react-query'
import z from 'zod'

import {createOverlay} from '#/hooks/use-overlay'
import {createFeedMutation, listFeedsQueryKey} from '#/lib/api'

import {useAppForm, useFormErrors} from '../form'
import {Dialog, DialogContent, DialogFooter, DialogHeader} from '../ui/dialog'

export const CreateFeedDialog = createOverlay(({open, onOpenChange, onExitComplete}) => {
  const queryClient = useQueryClient()
  const createFeed = useMutation({
    ...createFeedMutation(),
  })

  const {formElement, focusErroredField, forwardErrorToForm} = useFormErrors()
  const form = useAppForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onChange: z.object({
        url: z.url(),
      }),
    },
    onSubmit: async ({value, formApi}) => {
      console.log(value)
      await createFeed.mutateAsync(
        {
          body: value,
        },
        {
          onError: forwardErrorToForm(formApi),
          onSuccess: () => {
            queryClient.invalidateQueries({queryKey: listFeedsQueryKey()})
            onOpenChange?.({open: false})
          },
        }
      )
    },
    onSubmitInvalid: focusErroredField,
  })

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={open => onOpenChange?.({open})}
      onOpenChangeComplete={open => !open && onExitComplete?.()}
      open={open}
    >
      <DialogContent>
        <form
          ref={formElement}
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          noValidate
        >
          <form.AppForm>
            <DialogHeader>Create feed</DialogHeader>

            <form.AppField name="url">{field => <field.TextField label="Feed URL" type="url" />}</form.AppField>
            <form.FormError />

            <DialogFooter>
              <form.SubmitButton>Add feed</form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  )
})
