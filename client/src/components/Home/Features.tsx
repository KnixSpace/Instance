import { cn } from '@/lib/utils'
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from '@tabler/icons-react'
import Link from 'next/link'

export function Features() {
  const features = [
    {
      title: 'Drag-and-Drop Interface',
      description:
        'Create complex workflows in minutes with our intuitive drag-and-drop functionality. No coding requied!',
      icon: <IconCloud />,
    },
    {
      title: 'Custom Triggers & Actions',
      description:
        'Choose from wide array of triggers and actions to personalize your workflows, ensuring they fit your unique business needs.',
      icon: <IconEaseInOut />,
    },
    {
      title: 'Real-Time Analytics Dashboard',
      description:
        'Gain insights into your workflows with real-time analytics, helping you make informed decisions and improve efficiency.',
      icon: <IconCurrencyDollar />,
    },
    {
      title: '100% Uptime guarantee',
      description: 'We just cannot be taken down by anyone.',
      icon: <IconHelp />,
    },
    // {
    //   title: "Multi-tenant Architecture",
    //   description: "You can simply share passwords instead of buying new seats",
    //   icon: <IconRouteAltLeft />,
    // },
    // {
    //   title: "24/7 Customer Support",
    //   description:
    //     "We are available a 100% of the time. Atleast our AI Agents are.",
    //   icon: <IconHelp />,
    // },
    // {
    //   title: "Money back guarantee",
    //   description:
    //     "If you donot like EveryAI, we will convince you to like us.",
    //   icon: <IconAdjustmentsBolt />,
    // },
    // {
    //   title: "And everything else",
    //   description: "I just ran out of copy ideas. Accept my sincere apologies",
    //   icon: <IconHeart />,
    // },
  ]
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <>
            <Feature key={feature.title} {...feature} index={index} />
          </>
        ))}
      </div>
      <Link
        href={'/register'}
        className="relative flex justify-center items-center overflow-hidden rounded-full p-px"
      >
        <span className="z-10 flex items-center justify-center px-8 py-2 bg-background rounded-full h-full w-full">
          Let's Automate
        </span>
        <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7441FE_0%,#E3D9FE_50%,#7441FE_100%)]" />
      </Link>
    </>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800',
        (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
        index < 4 && 'lg:border-b dark:border-neutral-800'
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  )
}
