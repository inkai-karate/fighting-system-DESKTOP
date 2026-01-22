import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@renderer/components/ui/alert-dialog'

interface MyAlertDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  onConfirm?: () => void
  onCancel?: () => void
  onOpenChange?: (open: boolean) => void
}

import PropTypes from 'prop-types'

export const MyAlertDialog: React.FC<MyAlertDialogProps> = ({
  open,
  title = 'Konfirmasi',
  description = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya',
  cancelText = 'Batal',
  confirmColor = 'bg-red-600 hover:bg-red-700 text-white',
  onConfirm,
  onCancel,
  onOpenChange
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={confirmColor}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

MyAlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onOpenChange: PropTypes.func
}
