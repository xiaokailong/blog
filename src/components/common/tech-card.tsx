'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'

interface TechCardProps {
  name: string
  description: string
  icon: string
  url: string
  category: string
  index: number
}

export function TechCard({ name, description, icon, url, category, index }: TechCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      {/* Category Badge */}
      <div className="absolute top-4 right-4">
        <span className="text-xs font-medium text-gray-400">{category}</span>
      </div>

      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-4xl">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
            {name}
          </h3>
          <ExternalLinkIcon className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="flex-1 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-gray-900/5" />
    </motion.a>
  )
}
