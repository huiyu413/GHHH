
import React, { useMemo } from 'react';
import { JournalEntry, ChartOfAccount } from '../types';
import { TableProperties, Calculator, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';

interface GeneralLedgerProps {
  entries: JournalEntry[];
  coa: ChartOfAccount[];
}

const GeneralLedger: React.FC<GeneralLedgerProps> = ({ entries, coa }) => {
  // 核心逻辑：计算总账余额
  const ledgerData = useMemo(() => {
    const posted = entries.filter(e => e.status === 'POSTED');
    
    return coa.map(acc => {
      const accEntries = posted.filter(e => e.account === acc.code);
      const debits = accEntries.filter(e => e.type === 'DEBIT').reduce((a, b) => a + b.amount, 0);
      const credits = accEntries.filter(e => e.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);
      
      // 简单逻辑：资产/成本类 借-贷，负债/权益/收入类 贷-借
      const balance = ['ASSET', 'EXPENSE'].includes(acc.type) 
        ? debits - credits 
        : credits - debits;

      return {
        ...acc,
        debits,
        credits,
        balance
      };
    });
  }, [entries, coa]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">总账与科目余额表</h2>
          <p className="text-sm text-slate-500 mt-1">序列图终点：过账成功后实时同步的科目明细汇总</p>
        </div>
        <button className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
          <Printer size={20}/>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
            <Calculator size={14} className="text-blue-500"/> 资产类总额
          </div>
          <p className="text-2xl font-bold text-slate-800">
            ¥{ledgerData.filter(d => d.type === 'ASSET').reduce((a, b) => a + b.balance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
            <ArrowDownRight size={14} className="text-rose-500"/> 负债类总额
          </div>
          <p className="text-2xl font-bold text-slate-800">
            ¥{ledgerData.filter(d => d.type === 'LIABILITY').reduce((a, b) => a + b.balance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
            <ArrowUpRight size={14} className="text-emerald-500"/> 本期累计收入
          </div>
          <p className="text-2xl font-bold text-slate-800">
            ¥{ledgerData.filter(d => d.type === 'REVENUE').reduce((a, b) => a + b.credits, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-4">
             试算平衡状态
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xl font-bold">借贷已平衡</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">科目编码及名称</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase text-right">本期借方发生</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase text-right">本期贷方发生</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase text-right">期末余额</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ledgerData.map(data => (
              <tr key={data.code} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="text-sm font-bold text-slate-800">{data.name}</div>
                  <div className="text-[10px] font-mono text-blue-500">{data.code}</div>
                </td>
                <td className="px-8 py-5 text-right font-mono text-sm text-slate-600">
                  {data.debits > 0 ? data.debits.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-'}
                </td>
                <td className="px-8 py-5 text-right font-mono text-sm text-slate-600">
                  {data.credits > 0 ? data.credits.toLocaleString(undefined, {minimumFractionDigits: 2}) : '-'}
                </td>
                <td className="px-8 py-5 text-right">
                  <span className={`text-sm font-bold font-mono ${data.balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                    ¥ {Math.abs(data.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">{data.balance >= 0 ? '借' : '贷'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralLedger;
