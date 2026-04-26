import {createFormHook, createFormHookContexts, FormApi} from '@tanstack/react-form'
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

export {useAppForm, useFieldContext, useFormContext, withFieldGroup, withForm}

export type UseAppFormReturn = ReturnType<typeof useAppForm>

export function useFormErrors() {
  const formElement = useRef<HTMLFormElement | null>(null)

  return {
    formElement,
    focusErroredField: () => {
      // @ts-expect-error
      formElement.current?.querySelector('[aria-invalid=true]')?.focus()
    },
    forwardErrorToForm:
      <A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any, K = any>(
        // @ts-expect-error
        formApi: FormApi<A, B, C, D, E, F, G, H, I, J, K, any>
      ) =>
      (error: unknown) => {
        formApi.setErrorMap({
          onSubmit: {form: error, fields: {}},
        })
      },
  }
}
