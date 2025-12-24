
import React, { useState } from 'react';
import { Customer } from '../types';
import { UserPlus, Search, Mail, Phone, MoreVertical, CreditCard } from 'lucide-react';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm"
            placeholder="搜索客户名称、联系人..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
          <UserPlus size={18} /> 新增客户
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.filter(c => c.name.includes(query)).map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                  {c.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{c.name}</h4>
                  <p className="text-xs text-slate-400">{c.id}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreVertical size={16}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone size={14}/> {c.phone}</div>
              <div className="flex items-center gap-2 text-slate-600"><Mail size={14}/> {c.email}</div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">应收余额</p>
                <p className="text-lg font-bold text-slate-800">¥{c.balance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">信用额度</p>
                <p className="text-sm font-medium text-slate-600">¥{c.creditLimit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
