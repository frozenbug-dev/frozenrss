import {useMutation, useQueryClient} from '@tanstack/react-query'
import z from 'zod'

import {createOverlay} from '#/hooks/use-overlay'
import {listFeedsQueryKey} from '#/lib/api'

import {useAppForm, useFormErrors} from '../form'
import {Dialog, DialogContent, DialogFooter, DialogHeader} from '../ui/dialog'

export const EditFeedDialog = createOverlay<{
  feedId: string
  feedUrl: string
  feedTitle: string | null
  feedDescription: string | null
}>(({open, onOpenChange, onExitComplete, feedId, feedUrl, feedTitle, feedDescription}) => {
  const queryClient = useQueryClient()

  const updateFeed = useMutation({
    mutationFn: async (values: {url?: string; title?: string; description?: string}) => {
      const res = await fetch(`/api/feeds/${feedId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed to update feed')
      return res.json()
    },
  })

  const {formElement, focusErroredField, forwardErrorToForm} = useFormErrors()
  const form = useAppForm({
    defaultValues: {
      url: feedUrl,
      title: feedTitle ?? '',
      description: feedDescription ?? '',
    },
    validators: {
      onChange: z.object({
        url: z.url(),
        title: z.string(),
        description: z.string(),
      }),
    },
    onSubmit: async ({value, formApi}) => {
      await updateFeed.mutateAsync(value, {
        onError: forwardErrorToForm(formApi),
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: listFeedsQueryKey()})
          onOpenChange?.({open: false})
        },
      })
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
            <DialogHeader>Edit feed</DialogHeader>

            <form.AppField name="url">{field => <field.TextField label="Feed URL" type="url" />}</form.AppField>
            <form.AppField name="title">{field => <field.TextField label="Title" />}</form.AppField>
            <form.AppField name="description">{field => <field.Textarea label="Description" />}</form.AppField>
            <form.FormError />

            <DialogFooter>
              <form.SubmitButton>Save changes</form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  )
})
