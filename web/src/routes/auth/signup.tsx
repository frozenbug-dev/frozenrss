import {useMutation} from '@tanstack/react-query'
import {Link, createFileRoute, useNavigate, useSearch} from '@tanstack/react-router'
import {z} from 'zod'

import {useAppForm, useErrorFocus} from '#/components/form'
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
      if (error) {
        throw new Error(error.message ?? 'Sign up failed')
      }
      return data
    },
    onSuccess: () => {
      navigate({to: search.redirect || '/'})
    },
  })

  const {formElement, focusErroredField} = useErrorFocus()
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies SignupValues,
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({value}) => {
      await signupMutation.mutateAsync(value)
    },
    onSubmitInvalid: focusErroredField,
  })

  return (
    <>
      <h2 className="text-xl font-semibold text-foreground">Create account</h2>

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
          <form.AppField name="email">{field => <field.TextField label="Email" type="email" required />}</form.AppField>
          <form.AppField name="password">{field => <field.PasswordField label="Password" required />}</form.AppField>
          <form.AppField name="confirmPassword">
            {field => <field.PasswordField label="Confirm password" required />}
          </form.AppField>

          <form.FormError />

          <form.SubmitButton className="mt-2 w-full">Create account</form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="text-center text-sm text-default-500">
        Already have an account?{' '}
        <Link to="/auth" search={{redirect: search.redirect}} className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
