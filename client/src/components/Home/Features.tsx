import { HoverEffect } from '../ui/card-hover-effect'

export function Features() {
  return (
    <div className="innerContainer mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  )
}
export const projects = [
  {
    title: 'Drag-and-Drop Interface',
    description:
      'Create complex workflows in minutes with our intuitive drag-and-drop functionality. No coding required!',
    link: '#',
  },
  {
    title: 'Custom Triggers & Actions',
    description:
      'Choose from a wide array of triggers and actions to personalize your workflows, ensuring they fit your unique business needs',
    link: '#',
  },
  {
    title: 'Real-Time Analytics Dashboard',
    description:
      'Gain insights into your workflows with real-time analytics, helping you make informed decisions and improve efficiency.',
    link: '#',
  },
]