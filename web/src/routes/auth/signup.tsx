import {useMutation} from '@tanstack/react-query'
import {Link, createFileRoute, useNavigate, useSearch} from '@tanstack/react-router'
import {z} from 'zod'

import {useAppForm, useFormErrors} from '#/components/form'
import {CardContent, CardFooter, CardHeader} from '#/components/ui/card'
import {authClient} from '#/lib/auth-client'
import {type SignupValues, signupSchema} from '#/lib/auth-schemas'

const signupSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/auth/signup')({
  validateSearch: signupSearchSchema,
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const search = useSearch({from: '/auth/signup'})

  const signupMutation = useMutation({
    mutationFn: async (values: SignupValues) => {
      const {data, error} = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      navigate({to: search.redirect || '/'})
    },
  })

  const {formElement, focusErroredField, forwardErrorToForm} = useFormErrors()
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies SignupValues,
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({value, formApi}) => {
      await signupMutation.mutateAsync(value, {
        onError: forwardErrorToForm(formApi),
      })
    },
    onSubmitInvalid: focusErroredField,
  })

  return (
    <>
      <CardHeader>
        <h2 className="text-xl font-semibold text-foreground">Create account</h2>
      </CardHeader>

      <CardContent>
        <form
          ref={formElement}
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-3"
          noValidate
        >
          <form.AppForm>
            <form.AppField name="name">{field => <field.TextField label="Name" required />}</form.AppField>
            <form.AppField name="email">
              {field => <field.TextField label="Email" type="email" required />}
            </form.AppField>
            <form.AppField name="password">{field => <field.PasswordField label="Password" required />}</form.AppField>
            <form.AppField name="confirmPassword">
              {field => <field.PasswordField label="Confirm password" required />}
            </form.AppField>

            <form.FormError />

            <form.SubmitButton className="mt-2 w-full">Create account</form.SubmitButton>
          </form.AppForm>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-center text-sm text-default-500 flex gap-x-2 justify-center">
          <span>Already have an account?</span>
          <Link
            to="/auth"
            search={{redirect: search.redirect}}
            className="font-medium text-primary-foreground underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </>
  )
}
