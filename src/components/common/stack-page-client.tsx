'use client'

import { useState } from 'react'
import { TechCard } from '@/components/common/tech-card'
import { TECH_STACK_ITEMS } from '@/lib/tech-stack'

const categories = ['All', 'Framework', 'Library', 'Tool', 'Design', 'Learning']

export function StackPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredItems = selectedCategory === 'All'
    ? TECH_STACK_ITEMS
    : TECH_STACK_ITEMS.filter(item => item.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tech Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item, index) => (
          <TechCard
            key={item.name}
            name={item.name}
            description={item.description}
            icon={item.icon}
            url={item.url}
            category={item.category}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
