import React, { ReactNode } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'

const ChipVariance = cva('px-2 text-sm rounded-xl font-semibold', {
  variants: {
    variant: {
      default: 'bg-slate-300 text-slate-700',
      primary: 'bg-blue-300 text-blue-700',
      success: 'bg-green-300 text-green-700',
      warning: 'bg-yellow-300 text-yellow-700',
      danger: 'bg-red-300 text-red-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface Props extends VariantProps<typeof ChipVariance> {
  children: ReactNode
}

const Chip: React.FC<Props> = ({ children, variant }) => {
  return <span className={clsx(ChipVariance({ variant }))}>{children}</span>
}

export default Chip
