'use client'
import React, { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconEdit,
  IconEye,
  IconFile,
  IconSearch,
  IconSettings,
  IconUserBolt,
} from '@tabler/icons-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '../../lib/utils'

const SidebarDemo = () => {
  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Profile',
      href: '#',
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Ongoing Flows',
      href: '#',
      icon: (
        <IconFile className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Completed Flows',
      href: '#',
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Drafts',
      href: '#',
      icon: (
        <IconEdit className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Logs',
      href: '#',
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Connected Apps',
      href: '#',
      icon: (
        <IconEye className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ]
  const [open, setOpen] = useState(false)
  return (
    <div className="h-dvh w-full">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 h-full w-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-2">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Log Out',
                href: '#',
                icon: (
                  <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  )
}

export default SidebarDemo

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex gap-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/logo.webp" // Path to your image in the public folder
        alt="Logo"
        width={30} // Set the width
        height={30} // Set the height
      />
      <motion.span
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        className=" text-base font-medium text-black dark:text-white whitespace-pre "
      >
        Instance
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  )
}
