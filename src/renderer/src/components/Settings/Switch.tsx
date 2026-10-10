import clsx from 'clsx'

interface SwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ id, checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={clsx(
        'relative h-5 w-9 flex-shrink-0 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-secondary',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
