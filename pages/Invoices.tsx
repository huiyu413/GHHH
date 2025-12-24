
import React from 'react';
import { Invoice, Customer } from '../types';
import { Plus, Download, Printer, CheckCircle } from 'lucide-react';

interface InvoicesProps {
  invoices: Invoice[];
  customers: Customer[];
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, customers }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">销售单据管理</h3>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <Plus size={18} /> 开具新发票
        </button>
      </div>

      <div className="space-y-4">
        {invoices.map(inv => {
          const customer = customers.find(c => c.id === inv.customerId);
          const total = inv.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
          return (
            <div key={inv.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-800">{inv.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {inv.status === 'PAID' ? '已收讫' : '已发送'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-700">{customer?.name}</h4>
                <p className="text-xs text-slate-400 mt-1">开票日期: {inv.date} | 到期日期: {inv.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold mb-1 uppercase">合计金额(含税)</p>
                <p className="text-xl font-bold text-slate-900">¥{(total * (1 + inv.taxRate)).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 border-l border-slate-100 pl-6 ml-6">
                <button className="p-2 text-slate-400 hover:text-blue-600"><Printer size={18}/></button>
                <button className="p-2 text-slate-400 hover:text-blue-600"><Download size={18}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Invoices;
