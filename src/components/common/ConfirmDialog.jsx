import { HiExclamation } from 'react-icons/hi'
import { Button, Modal } from '../ui/index'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Please Confirm',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  tone = 'danger',
}) {
  const toneClasses = tone === 'danger'
    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${toneClasses}`}>
            <HiExclamation className="h-6 w-6" />
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
