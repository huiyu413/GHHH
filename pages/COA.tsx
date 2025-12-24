
import React, { useState } from 'react';
import { ChartOfAccount } from '../types';
import { ListTree, Plus, Search, Info, Edit3, Trash2, X } from 'lucide-react';

interface COAProps {
  coa: ChartOfAccount[];
  setCoa: React.Dispatch<React.SetStateAction<ChartOfAccount[]>>;
}

const COA: React.FC<COAProps> = ({ coa, setCoa }) => {
  const [showModal, setShowModal] = useState(false);
  const [newAcc, setNewAcc] = useState<Partial<ChartOfAccount>>({ code: '', name: '', type: 'ASSET' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (coa.some(a => a.code === newAcc.code)) {
      alert('该科目编码已存在！');
      return;
    }
    setCoa(prev => [...prev, newAcc as ChartOfAccount].sort((a, b) => a.code.localeCompare(b.code)));
    setShowModal(false);
    setNewAcc({ code: '', name: '', type: 'ASSET' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-800">会计科目体系</h3>
          <p className="text-sm text-slate-500">管理您的总账科目及核算项目明细</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18}/> 新增科目
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2 text-xs text-blue-600 font-bold">
          <Info size={14}/> 提示：您可以在此处定义管理会计明细科目，例如 1002.01 招商银行
        </div>
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">编码</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">科目名称</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">类型</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coa.map(acc => (
              <tr key={acc.code} className="hover:bg-slate-50/50 group transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600">{acc.code}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{acc.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    acc.type === 'ASSET' ? 'bg-blue-50 text-blue-600' :
                    acc.type === 'LIABILITY' ? 'bg-rose-50 text-rose-600' : 
                    acc.type === 'EQUITY' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {acc.type === 'ASSET' ? '资产' : acc.type === 'LIABILITY' ? '负债' : acc.type === 'EQUITY' ? '权益' : '损益'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-800">新增会计科目</h4>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">科目编码</label>
                <input 
                  required type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="如：1002.01"
                  value={newAcc.code}
                  onChange={e => setNewAcc({...newAcc, code: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">科目名称</label>
                <input 
                  required type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="如：招商银行深圳分行"
                  value={newAcc.name}
                  onChange={e => setNewAcc({...newAcc, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">科目类型</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                  value={newAcc.type}
                  onChange={e => setNewAcc({...newAcc, type: e.target.value as any})}
                >
                  <option value="ASSET">资产</option>
                  <option value="LIABILITY">负债</option>
                  <option value="EQUITY">权益</option>
                  <option value="REVENUE">收入</option>
                  <option value="EXPENSE">成本费用</option>
                </select>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 mt-4">确认保存</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default COA;
