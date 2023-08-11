import clsx from 'clsx'
import { cva, VariantProps } from 'class-variance-authority'
import Spinner from '@/components/spinner'

const ButtonVariance = cva('font-semibold flex gap-2 items-center', {
  variants: {
    shape: {
      circle: 'rounded-full',
      round: 'rounded-3xl',
      default: 'rounded-none',
    },
    size: {
      sm: 'px-3 text-sm',
      md: 'px-3 py-2 text-md',
      xl: 'px-5 py-3 text-xl',
    },
    variant: {
      default:
        'bg-white outline outline-2 outline-slate-300 text-slate-400 hover:outline-blue-400 hover:text-blue-400',
      primary: 'bg-blue-500 hover:bg-blue-400 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-400 text-black',
      danger: 'bg-red-500 hover:bg-red-400 text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'default',
    variant: 'default',
  },
  compoundVariants: [],
})

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariance> {
  loading?: boolean
}

const Button: React.FC<CustomButtonProps> = ({
  shape,
  size,
  variant,
  loading = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        ButtonVariance({ shape, size, variant }),
      )}
    >
      {loading && <Spinner />}
      {props.children}
    </button>
  )
}

export default Button
