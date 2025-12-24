
import React from 'react';
import { JournalEntry } from '../types';
import { Percent, Activity, FileText, CheckCircle2 } from 'lucide-react';

interface TaxationProps {
  entries: JournalEntry[];
}

const Taxation: React.FC<TaxationProps> = ({ entries }) => {
  // 模拟增值税计算
  const salesIncome = entries.filter(e => e.account === '6001').reduce((a, b) => a + b.amount, 0);
  const vatOutput = salesIncome * 0.13;
  const vatInput = 1250.40; // 模拟进项税

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">本月销项税额 (估算)</p>
          <h3 className="text-3xl font-bold text-slate-800">¥{vatOutput.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 font-bold bg-blue-50 w-fit px-2 py-1 rounded">
            <Activity size={14}/> 实时计算中
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">本月进项税额</p>
          <h3 className="text-3xl font-bold text-slate-800">¥{vatInput.toLocaleString()}</h3>
          <p className="mt-4 text-xs text-slate-400 font-medium">来自已认证抵扣凭证</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">预计缴纳增值税</p>
          <h3 className="text-3xl font-bold text-emerald-400">¥{(vatOutput - vatInput).toLocaleString()}</h3>
          <button className="mt-4 w-full py-2 bg-blue-600 rounded-xl text-xs font-bold">申报模拟</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
          <FileText size={20} className="text-indigo-600"/> 税务合规性自检
        </h4>
        <div className="space-y-4">
          {[
            { label: '增值税销项与收入匹配', status: true },
            { label: '进项税额抵扣凭证完整性', status: true },
            { label: '印花税计提基数校验', status: false },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
              {item.status ? (
                <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold"><CheckCircle2 size={14}/> 通过</span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1 text-xs font-bold">待修正</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Taxation;
