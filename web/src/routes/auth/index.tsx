import {useMutation} from '@tanstack/react-query'
import {Link, createFileRoute, useNavigate, useSearch} from '@tanstack/react-router'
import {z} from 'zod'

import {useAppForm, useErrorFocus} from '#/components/form'
import {authClient} from '#/lib/auth-client'
import {type LoginValues, loginSchema} from '#/lib/auth-schemas'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/auth/')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({from: '/auth/'})

  const loginMutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const {data, error} = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })
      if (error) {
        throw new Error(error.message ?? 'Invalid email or password')
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
      email: '',
      password: '',
    } satisfies LoginValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({value}) => {
      await loginMutation.mutateAsync(value)
    },
    onSubmitInvalid: focusErroredField,
  })

  return (
    <>
      <h2 className="text-xl font-semibold text-foreground mb-4">Sign in</h2>

      <form
        ref={formElement}
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        className="flex flex-col gap-3 mb-4"
      >
        <form.AppForm>
          <form.AppField name="email">{field => <field.TextField label="Email" type="email" required />}</form.AppField>
          <form.AppField name="password">{field => <field.PasswordField label="Password" required />}</form.AppField>

          <form.FormError />

          <form.SubmitButton className="mt-2 w-full">Sign in</form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="text-center text-sm text-default-500">
        Don't have an account?{' '}
        <Link
          to="/auth/signup"
          search={{redirect: search.redirect}}
          className="font-medium text-accent hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  )
}
