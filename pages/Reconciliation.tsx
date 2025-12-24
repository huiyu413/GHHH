
import React, { useState } from 'react';
import { JournalEntry, BankStatementItem } from '../types';
import { MOCK_BANK_STATEMENTS } from '../constants';
import { 
  ShieldCheck, 
  FileSearch, 
  ArrowRightLeft, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Link,
  Zap,
  RefreshCw
} from 'lucide-react';

interface ReconciliationProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const Reconciliation: React.FC<ReconciliationProps> = ({ entries, setEntries }) => {
  const [bankItems, setBankItems] = useState<BankStatementItem[]>(MOCK_BANK_STATEMENTS);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. 获取系统银行存款明细 (科目 1002)
  const systemBankEntries = entries.filter(e => e.account === '1002' && e.status === 'POSTED');
  
  // 2. 计算各项余额
  const systemBalance = systemBankEntries.reduce((acc, curr) => 
    curr.type === 'DEBIT' ? acc + curr.amount : acc - curr.amount, 0);
  
  const bankBalance = bankItems.reduce((acc, curr) => 
    curr.type === 'IN' ? acc + curr.amount : acc - curr.amount, 0);

  // 3. 自动匹配逻辑
  const handleAutoReconcile = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newSystemEntries = [...entries];
      const newBankItems = [...bankItems];

      newBankItems.forEach(bankItem => {
        const match = newSystemEntries.find(sysItem => 
          sysItem.account === '1002' &&
          sysItem.amount === bankItem.amount &&
          !sysItem.isReconciled &&
          ((sysItem.type === 'DEBIT' && bankItem.type === 'IN') || (sysItem.type === 'CREDIT' && bankItem.type === 'OUT'))
        );

        if (match) {
          match.isReconciled = true;
          bankItem.isMatched = true;
        }
      });

      setEntries(newSystemEntries);
      setBankItems(newBankItems);
      setIsProcessing(false);
    }, 1500);
  };

  // 4. 计算未达账项 (用于调节表)
  const bankOnlyIn = bankItems.filter(i => !i.isMatched && i.type === 'IN').reduce((a, b) => a + b.amount, 0);
  const bankOnlyOut = bankItems.filter(i => !i.isMatched && i.type === 'OUT').reduce((a, b) => a + b.amount, 0);
  const systemOnlyIn = systemBankEntries.filter(i => !i.isReconciled && i.type === 'DEBIT').reduce((a, b) => a + b.amount, 0);
  const systemOnlyOut = systemBankEntries.filter(i => !i.isReconciled && i.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);

  const adjustedSystemBalance = systemBalance + bankOnlyIn - bankOnlyOut;
  const adjustedBankBalance = bankBalance + systemOnlyIn - systemOnlyOut;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">系统账面余额</span>
            <FileSearch size={16} className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">¥ {systemBalance.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">银行对账单余额</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">¥ {bankBalance.toLocaleString()}</h3>
        </div>
        <div className={`p-6 rounded-2xl shadow-sm border ${Math.abs(systemBalance - bankBalance) === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">当前差额</span>
            <ArrowRightLeft size={16} className="text-amber-500" />
          </div>
          <h3 className={`text-2xl font-bold ${Math.abs(systemBalance - bankBalance) === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
            ¥ {Math.abs(systemBalance - bankBalance).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <Zap size={18} />
          </div>
          <span className="text-sm font-medium text-slate-600">智能对账引擎已准备就绪</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleAutoReconcile}
            disabled={isProcessing}
            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRightLeft size={18} />}
            {isProcessing ? '自动对账中...' : '启动自动对账'}
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <Download size={18} /> 导出调节表
          </button>
        </div>
      </div>

      {/* Dual Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: System Entries */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <FileSearch size={18} className="text-blue-600" /> 系统日记账 (1002)
            </h4>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">日期/摘要</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">金额</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {systemBankEntries.map(entry => (
                  <tr key={entry.id} className={`hover:bg-slate-50/50 transition-colors ${entry.isReconciled ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-6 py-3">
                      <p className="text-xs font-bold text-slate-700">{entry.description}</p>
                      <p className="text-[10px] text-slate-400">{entry.date}</p>
                    </td>
                    <td className={`px-6 py-3 text-xs font-mono font-bold text-right ${entry.type === 'DEBIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.type === 'DEBIT' ? '+' : '-'} {entry.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {entry.isReconciled ? (
                        <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 mx-auto"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Bank Statement */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" /> 银行对账单明细
            </h4>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">日期/摘要</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">金额</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">匹配</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bankItems.map(item => (
                  <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${item.isMatched ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-6 py-3">
                      <p className="text-xs font-bold text-slate-700">{item.description}</p>
                      <p className="text-[10px] text-slate-400">{item.date}</p>
                    </td>
                    <td className={`px-6 py-3 text-xs font-mono font-bold text-right ${item.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'IN' ? '+' : '-'} {item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {item.isMatched ? (
                        <Link size={16} className="text-emerald-500 mx-auto" />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Adjustment Report */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck size={120} />
        </div>
        <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xs">调</span>
          银行存款余额调节表
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-sm">企业银行存款日记账余额</span>
              <span className="font-mono font-bold">¥ {systemBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span className="text-sm">+ 银行已收、企业未收</span>
              <span className="font-mono">¥ {bankOnlyIn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span className="text-sm">- 银行已付、企业未付</span>
              <span className="font-mono">¥ {bankOnlyOut.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-4 border-t-2 border-white/20 font-bold text-lg">
              <span>调节后余额</span>
              <span className="text-blue-400">¥ {adjustedSystemBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-sm">银行对账单余额</span>
              <span className="font-mono font-bold">¥ {bankBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span className="text-sm">+ 企业已收、银行未收</span>
              <span className="font-mono">¥ {systemOnlyIn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span className="text-sm">- 企业已付、银行未付</span>
              <span className="font-mono">¥ {systemOnlyOut.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-4 border-t-2 border-white/20 font-bold text-lg">
              <span>调节后余额</span>
              <span className="text-blue-400">¥ {adjustedBankBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          {Math.abs(adjustedSystemBalance - adjustedBankBalance) < 0.01 ? (
            <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 font-bold">
              <CheckCircle size={20} />
              对账平衡：账务记录与银行流水完全一致
            </div>
          ) : (
            <div className="flex items-center gap-3 px-8 py-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-400 font-bold animate-pulse">
              <AlertTriangle size={20} />
              对账不平衡：存在未核销项，请手动检查差异
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;
