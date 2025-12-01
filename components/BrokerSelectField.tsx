// BrokerSelectField.tsx
// Dropdown for selecting a broker in the property form (admin only)
import React from 'react';

interface Broker {
  id: string;
  name: string;
  email: string;
}

interface BrokerSelectFieldProps {
  brokers: Broker[];
  value: string;
  onChange: (id: string) => void;
}

const BrokerSelectField: React.FC<BrokerSelectFieldProps> = ({ brokers, value, onChange }) => (
  <div>
    <label className="text-sm font-medium mb-2 block">Broker</label>
    <select
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select Broker</option>
      {brokers.map(broker => (
        <option key={broker.id} value={broker.id}>
          {broker.name || broker.email}
        </option>
      ))}
    </select>
  </div>
);

export default BrokerSelectField;
