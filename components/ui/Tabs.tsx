import React, { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialTab?: number;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialTab = 0, className = '' }) => {
  const [active, setActive] = useState(initialTab);
  return (
    <div className={className}>
      <div className="flex border-b mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-6 py-2 font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
              i === active
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActive(i)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
};

export default Tabs;
