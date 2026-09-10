import React, { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Label } from './label'
import { Separator } from './separator'

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.ComponentProps<'fieldset'>>(
  ({ className, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn(
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
)
FieldSet.displayName = 'FieldSet'

interface IFieldLegendProps extends React.ComponentProps<'legend'> {
  variant?: 'legend' | 'label'
}

const FieldLegend = React.forwardRef<HTMLLegendElement, IFieldLegendProps>(
  ({ className, variant = 'legend', ...props }, ref) => (
    <legend
      ref={ref}
      data-variant={variant}
      className={cn('mb-3 font-medium', variant === 'legend' ? 'text-base' : 'text-sm', className)}
      {...props}
    />
  )
)
FieldLegend.displayName = 'FieldLegend'

const FieldGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
        className
      )}
      {...props}
    />
  )
)
FieldGroup.displayName = 'FieldGroup'

const fieldVariants = cva('group/field data-[invalid=true]:text-destructive flex w-full gap-3', {
  variants: {
    orientation: {
      vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
      horizontal: [
        'flex-row items-center',
        '[&>[data-slot=field-label]]:flex-auto',
        'has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start'
      ],
      responsive: [
        '@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto',
        '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
        '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
      ]
    }
  },
  defaultVariants: {
    orientation: 'vertical'
  }
})

interface IFieldProps extends React.ComponentProps<'div'>, VariantProps<typeof fieldVariants> {}

const Field = React.forwardRef<HTMLDivElement, IFieldProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
)
Field.displayName = 'Field'

const FieldContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
      {...props}
    />
  )
)
FieldContent.displayName = 'FieldContent'

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentProps<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(
      'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
      'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4',
      'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5',
      className
    )}
    {...props}
  />
))
FieldLabel.displayName = 'FieldLabel'

const FieldTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium leading-snug group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
)
FieldTitle.displayName = 'FieldTitle'

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm font-normal leading-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance',
        'last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  )
)
FieldDescription.displayName = 'FieldDescription'

interface IFieldSeparatorProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
}

const FieldSeparator = React.forwardRef<HTMLDivElement, IFieldSeparatorProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-content={!!children}
      className={cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  )
)
FieldSeparator.displayName = 'FieldSeparator'

interface IFieldErrorProps extends React.ComponentProps<'div'> {
  errors?: Array<{ message?: string } | undefined>
}

const FieldError = React.forwardRef<HTMLDivElement, IFieldErrorProps>(
  ({ className, children, errors, ...props }, ref) => {
    const content = useMemo(() => {
      if (children) return children
      if (!errors) return null
      if (errors.length === 1 && errors[0]?.message) return errors[0].message
      return (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {errors.map(
            (error, index) =>
              error?.message && (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{error.message}</li>
              )
          )}
        </ul>
      )
    }, [children, errors])

    if (!content) return null

    return (
      <div
        ref={ref}
        role="alert"
        className={cn('text-sm font-normal text-destructive', className)}
        {...props}
      >
        {content}
      </div>
    )
  }
)
FieldError.displayName = 'FieldError'

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle
}
