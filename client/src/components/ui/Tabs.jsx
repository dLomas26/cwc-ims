import { useState } from 'react'

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-slate-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px',
            activeTab === tab.id
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300',
          ].join(' ')}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className={[
              'px-1.5 py-0.5 rounded-full text-xs font-semibold',
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-500',
            ].join(' ')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default Tabs
