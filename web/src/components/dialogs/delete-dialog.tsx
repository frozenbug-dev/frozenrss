import {useState} from 'react'

import {createOverlay} from '#/hooks/use-overlay'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'

export const DeleteDialog = createOverlay<{
  title: string
  description: React.ReactNode
  actionLabel: string
  onConfirm: () => void | Promise<void>
}>(({open, onOpenChange, title, description, actionLabel, onConfirm}) => {
  const [isPending, setIsPending] = useState(false)

  async function handleConfirm() {
    setIsPending(true)
    try {
      await onConfirm()
    } finally {
      setIsPending(false)
      onOpenChange?.({open: false})
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={open => !open && onOpenChange?.({open})}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})
