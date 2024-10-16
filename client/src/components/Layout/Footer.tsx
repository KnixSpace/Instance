import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="flex justify-center items-center  bg-[#0F1318]">
      <div className="flex justify-center items-center flex-col">
        <Image
          src="/logo.webp" // Path to your image in the public folder
          alt="Logo"
          width={60} // Set the width
          height={60} // Set the height
        />
        <h1 className="py-3   text-3xl"> INSTANCE</h1>
        <h2 className="text-gray-700 text-2xl">Automation Workflow Builder</h2>
        <div className="flex justify-center items-center flex-col">
          <h1 className='text-sm'>2024 Copyright Instance</h1>
        </div>
      </div>
    </footer>
  )
}

export default Footer
