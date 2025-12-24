
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { RefreshCw, CheckCircle, AlertCircle, Loader2, TableProperties, Sparkles } from 'lucide-react';

interface PostingProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const Posting: React.FC<PostingProps> = ({ entries, setEntries }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [postProgress, setPostProgress] = useState(0);

  const unpostedEntries = entries.filter(e => e.status === 'UNPOSTED');
  const totalUnpostedAmount = unpostedEntries.reduce((acc, curr) => acc + curr.amount, 0);

  const handleStartPosting = () => {
    if (unpostedEntries.length === 0) return;
    
    setIsPosting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPostProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const updatedEntries = entries.map(e => ({
            ...e,
            status: 'POSTED' as const
          }));
          setEntries(updatedEntries);
          setIsPosting(false);
          setPostProgress(0);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
            <RefreshCw size={14} className={isPosting ? 'animate-spin' : ''}/> 核心会计业务结转
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">批量过账与更新总账</h3>
          <p className="text-slate-500 leading-relaxed max-w-lg">
            依据业务序列图：系统将锁定未过账凭证，逐一验证科目合法性，并最终<span className="text-blue-600 font-bold">更新总账余额</span>。
          </p>
          <div className="flex gap-4 pt-4">
            <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">待结转项</span>
              <span className="text-2xl font-black text-slate-800">{unpostedEntries.length} <small className="text-xs text-slate-400">Pcs</small></span>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">预计结转额</span>
              <span className="text-2xl font-black text-slate-800">¥ {totalUnpostedAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="shrink-0">
          <button 
            disabled={unpostedEntries.length === 0 || isPosting}
            onClick={handleStartPosting}
            className={`w-24 h-24 rounded-full font-bold flex flex-col items-center justify-center gap-2 transition-all active:scale-90 ${
              unpostedEntries.length === 0 
              ? 'bg-slate-100 text-slate-300' 
              : 'bg-blue-600 text-white shadow-2xl shadow-blue-200 hover:bg-blue-700'
            }`}
          >
            {isPosting ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24}/>}
            <span className="text-[10px]">{isPosting ? '处理中' : '过账'}</span>
          </button>
        </div>
      </div>

      {isPosting && (
        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h4 className="text-xl font-bold mb-1">正在执行序列任务</h4>
              <p className="text-xs text-slate-400">Task: Update_General_Ledger_Job_{new Date().getTime()}</p>
            </div>
            <span className="text-4xl font-black text-blue-400">{postProgress}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              style={{ width: `${postProgress}%` }}
            ></div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {[
              { label: '分录记录存档', threshold: 30 },
              { label: '科目余额试算', threshold: 60 },
              { label: '同步至总分类账', threshold: 90 },
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 transition-opacity duration-500 ${postProgress >= step.threshold ? 'opacity-100' : 'opacity-20'}`}>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-300">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 待过账清单 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <TableProperties size={20} className="text-slate-400"/>
             <span className="font-bold text-slate-700">未结转流水队列</span>
          </div>
        </div>
        {unpostedEntries.length === 0 ? (
          <div className="p-20 text-center">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32}/>
             </div>
             <p className="text-slate-400 font-bold">暂无待过账数据，总账已是最新状态</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {unpostedEntries.map(entry => (
              <div key={entry.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-xs font-mono text-slate-300">{entry.date}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{entry.description}</div>
                    <div className="text-[10px] text-blue-500 font-mono">DR/CR Account: {entry.account}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${entry.type === 'DEBIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.type === 'DEBIT' ? '借方' : '贷方'} ¥{entry.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-500 font-bold">待记录 (Waiting)</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posting;
