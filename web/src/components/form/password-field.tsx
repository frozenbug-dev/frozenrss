import {Eye, EyeOff} from 'lucide-react'
import {AnimatePresence, motion} from 'motion/react'
import {forwardRef, useState} from 'react'

import {Field, FieldDescription, FieldError, FieldLabel} from '#/components/ui/field'
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '#/components/ui/input-group'

import {useFieldContext, useFormContext} from './index'

interface PasswordFieldProps {
  label: string
  required?: boolean
  hideLabel?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
  className?: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  {required, hideLabel, label, helpText, disabled, placeholder, className},
  ref
) {
  const field = useFieldContext<string>()
  const form = useFormContext()
  const [isVisible, setIsVisible] = useState(false)
  const hasErrors = form.state.submissionAttempts > 0 && field.state.meta.errors.length > 0

  return (
    <Field className={className} data-invalid={hasErrors}>
      <FieldLabel className={hideLabel ? 'sr-only' : undefined}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          name={field.name}
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
          onBlur={() => field.handleBlur()}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasErrors}
          required={required}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            onClick={() => setIsVisible(!isVisible)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {isVisible ? (
                <motion.span
                  key="eye"
                  className="inline-flex"
                  initial={{scale: 0.8, opacity: 0, filter: 'blur(4px)'}}
                  animate={{scale: 1, opacity: 1, filter: 'blur(0px)'}}
                  exit={{scale: 0.8, opacity: 0, filter: 'blur(4px)'}}
                  transition={{duration: 0.4, ease: [0.23, 1, 0.32, 1]}}
                >
                  <Eye className="size-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="eyeOff"
                  className="inline-flex"
                  initial={{scale: 0.8, opacity: 0, filter: 'blur(4px)'}}
                  animate={{scale: 1, opacity: 1, filter: 'blur(0px)'}}
                  exit={{scale: 0.8, opacity: 0, filter: 'blur(4px)'}}
                  transition={{duration: 0.4, ease: [0.23, 1, 0.32, 1]}}
                >
                  <EyeOff className="size-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {helpText && <FieldDescription>{helpText}</FieldDescription>}
      {hasErrors && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
})
