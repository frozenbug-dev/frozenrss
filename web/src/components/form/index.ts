import {createFormHook, createFormHookContexts} from '@tanstack/react-form'
import {useRef} from 'react'

import {CheckBox} from './checkbox'
import {FormError} from './form-error'
import {NumberInput} from './number-input'
import {PasswordField} from './password-field'
import {Select} from './select'
import {SubmitButton} from './submit-button'
import {Switch} from './switch'
import {TextField} from './text-field'
import {Textarea} from './textarea'

const {fieldContext, formContext, useFieldContext, useFormContext} = createFormHookContexts()

const {useAppForm, withForm, withFieldGroup} = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    Textarea,
    NumberInput,
    Select,
    CheckBox,
    Switch,
  },
  formComponents: {
    SubmitButton,
    FormError,
  },
  fieldContext,
  formContext,
})

export {useFieldContext, useFormContext, useAppForm, withForm, withFieldGroup}

export type UseAppFormReturn = ReturnType<typeof useAppForm>

export function useErrorFocus() {
  const formElement = useRef<HTMLFormElement | null>(null)

  return {
    formElement,
    focusErroredField: () => {
      // @ts-expect-error
      formElement.current?.querySelector('[aria-invalid=true]')?.focus()
    },
  }
}
