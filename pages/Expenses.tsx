
import React from 'react';
import { ExpenseClaim, AppRole } from '../types';
import { Plus, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface ExpensesProps {
  expenses: ExpenseClaim[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseClaim[]>>;
  role: AppRole;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, setExpenses, role }) => {
  const isFinance = role === AppRole.FINANCE || role === AppRole.MANAGER;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">费用报销中心</h3>
          <p className="text-sm text-slate-500">{isFinance ? '当前待审核及已支付的申请' : '我的报销记录'}</p>
        </div>
        {!isFinance && (
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> 提交报销单
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">申请人/日期</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">类别/摘要</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">金额</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">状态</th>
              {isFinance && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800">{exp.employeeName}</p>
                  <p className="text-[10px] text-slate-400">{exp.date}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 mr-2">{exp.category}</span>
                  <span className="text-sm text-slate-600">{exp.description}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">¥{exp.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${
                    exp.status === 'PENDING' ? 'text-amber-500' : 
                    exp.status === 'APPROVED' ? 'text-blue-500' : 'text-emerald-500'
                  }`}>
                    {exp.status === 'PENDING' ? <Clock size={14}/> : <CheckCircle size={14}/>}
                    {exp.status === 'PENDING' ? '等待审核' : exp.status === 'APPROVED' ? '已核准' : '已支付'}
                  </span>
                </td>
                {isFinance && (
                  <td className="px-6 py-4 text-right">
                    {exp.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><XCircle size={18}/></button>
                        <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><CheckCircle size={18}/></button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
