import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({to: '/dash'})
  },
  component: Home,
})

function Home() {
  return <></>
}
