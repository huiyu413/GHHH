
import React, { useState } from 'react';
import { JournalEntry, ChartOfAccount } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';
import { Plus, Search, X, CheckCircle, Info, Trash2, ArrowRightLeft, Calculator } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  coa: ChartOfAccount[];
}

interface VoucherLine {
  id: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
}

const Journal: React.FC<JournalProps> = ({ entries, setEntries, coa }) => {
  const [showModal, setShowModal] = useState(false);
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [lines, setLines] = useState<VoucherLine[]>([
    { id: '1', description: '', account: coa[0].code, debit: 0, credit: 0 },
    { id: '2', description: '', account: coa[1].code, debit: 0, credit: 0 },
  ]);

  const addLine = () => setLines([...lines, { id: Math.random().toString(), description: '', account: coa[0].code, debit: 0, credit: 0 }]);
  const removeLine = (id: string) => setLines(lines.filter(l => l.id !== id));

  const totalDebit = lines.reduce((a, b) => a + b.debit, 0);
  const totalCredit = lines.reduce((a, b) => a + b.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSaveVoucher = () => {
    if (!isBalanced) {
      alert("借贷不平衡，无法保存！差额：" + Math.abs(totalDebit - totalCredit).toFixed(2));
      return;
    }

    const newEntries: JournalEntry[] = lines.map(l => ({
      id: Math.random().toString(36).substr(2, 9),
      date: voucherDate,
      description: l.description,
      account: l.account,
      amount: l.debit > 0 ? l.debit : l.credit,
      type: l.debit > 0 ? 'DEBIT' : 'CREDIT',
      currency: 'CNY',
      status: 'UNPOSTED'
    }));

    setEntries(prev => [...newEntries, ...prev]);
    setShowModal(false);
    setLines([
      { id: '1', description: '', account: coa[0].code, debit: 0, credit: 0 },
      { id: '2', description: '', account: coa[1].code, debit: 0, credit: 0 },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-800">记账凭证 (Voucher)</h3>
          <p className="text-sm text-slate-500">依据 UC003 规约，录入借贷平衡的财务分录</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all">
          <Plus size={20}/> 开具新凭证
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">日期</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">科目/摘要</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">借方</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">贷方</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{e.date}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{coa.find(a => a.code === e.account)?.name || e.account}</div>
                  <div className="text-[10px] text-slate-400 italic">{e.description}</div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">{e.type === 'DEBIT' ? `¥${e.amount.toLocaleString()}` : ''}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-rose-600">{e.type === 'CREDIT' ? `¥${e.amount.toLocaleString()}` : ''}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${e.status === 'POSTED' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                    {e.status === 'POSTED' ? '已过账' : '待处理'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100"><ArrowRightLeft size={24}/></div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">新增会计凭证</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">New Accounting Voucher</p>
                </div>
              </div>
              <input type="date" value={voucherDate} onChange={e => setVoucherDate(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white voucher-grid">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-4 px-2 text-xs font-black text-slate-800 uppercase w-1/4">摘要</th>
                    <th className="py-4 px-2 text-xs font-black text-slate-800 uppercase w-1/4">会计科目</th>
                    <th className="py-4 px-2 text-xs font-black text-slate-800 uppercase text-right w-1/5">借方金额</th>
                    <th className="py-4 px-2 text-xs font-black text-slate-800 uppercase text-right w-1/5">贷方金额</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map(line => (
                    <tr key={line.id} className="group">
                      <td className="py-2 px-1">
                        <input className="w-full px-2 py-2 bg-transparent text-sm focus:bg-slate-50 outline-none border-none transition-all" value={line.description} onChange={e => setLines(lines.map(l => l.id === line.id ? {...l, description: e.target.value} : l))} placeholder="业务简述" />
                      </td>
                      <td className="py-2 px-1">
                        <select className="w-full px-2 py-2 bg-transparent text-sm focus:bg-slate-50 outline-none border-none appearance-none font-medium cursor-pointer" value={line.account} onChange={e => setLines(lines.map(l => l.id === line.id ? {...l, account: e.target.value} : l))}>
                          {coa.map(acc => <option key={acc.code} value={acc.code}>{acc.code} {acc.name}</option>)}
                        </select>
                      </td>
                      <td className="py-2 px-1">
                        <input type="number" className="w-full text-right px-2 py-2 bg-transparent text-sm font-mono font-bold text-emerald-600 focus:bg-emerald-50 outline-none border-none" value={line.debit || ''} onChange={e => setLines(lines.map(l => l.id === line.id ? {...l, debit: parseFloat(e.target.value) || 0, credit: 0} : l))} placeholder="0.00" />
                      </td>
                      <td className="py-2 px-1">
                        <input type="number" className="w-full text-right px-2 py-2 bg-transparent text-sm font-mono font-bold text-rose-600 focus:bg-rose-50 outline-none border-none" value={line.credit || ''} onChange={e => setLines(lines.map(l => l.id === line.id ? {...l, credit: parseFloat(e.target.value) || 0, debit: 0} : l))} placeholder="0.00" />
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={() => removeLine(line.id)} className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addLine} className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl">
                <Plus size={14}/> 插入一行
              </button>
            </div>

            <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">借方合计 (Dr Total)</p>
                  <p className="text-2xl font-black text-emerald-400">¥ {totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">贷方合计 (Cr Total)</p>
                  <p className="text-2xl font-black text-rose-400">¥ {totalCredit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                {!isBalanced && totalDebit > 0 && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold animate-pulse">
                    <Calculator size={16}/> 借贷不平: {Math.abs(totalDebit - totalCredit).toFixed(2)}
                  </div>
                )}
                <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors">取消</button>
                <button 
                  disabled={!isBalanced} 
                  onClick={handleSaveVoucher}
                  className={`px-12 py-3 rounded-2xl font-bold transition-all shadow-xl ${isBalanced ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  保存并记账
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
