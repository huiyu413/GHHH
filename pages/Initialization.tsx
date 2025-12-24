
import React, { useState } from 'react';
import { CompanyInfo, ChartOfAccount } from '../types';
import { MOCK_CHART_OF_ACCOUNTS, SUPPORTED_CURRENCIES } from '../constants';
import { 
  CheckCircle2, Building2, Calculator, Settings2, Save, ArrowRight, ArrowLeft, 
  Sparkles, Briefcase, ShoppingBag, Factory, RefreshCcw, Landmark 
} from 'lucide-react';

interface InitializationProps {
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  onNavigate: (id: string) => void;
  onReset: () => void;
}

const Initialization: React.FC<InitializationProps> = ({ companyInfo, setCompanyInfo, onNavigate, onReset }) => {
  const [step, setStep] = useState(1);
  const [balances, setBalances] = useState<Record<string, number>>({});

  const applyTemplate = (type: 'service' | 'retail' | 'factory') => {
    let newBalances = {};
    let infoUpdates: Partial<CompanyInfo> = {};
    
    if (type === 'service') {
      newBalances = { '1002': 50000, '4001': 50000 };
      infoUpdates = { name: '未来咨询服务有限公司', scale: '微型', registeredCapital: 50000 };
    } else if (type === 'retail') {
      newBalances = { '1002': 100000, '1405': 30000, '4001': 130000 };
      infoUpdates = { name: '天天好物百货店', scale: '小型', registeredCapital: 130000 };
    } else {
      newBalances = { '1002': 200000, '1601': 150000, '4001': 350000 };
      infoUpdates = { name: '先锋精密制造厂', scale: '中型', registeredCapital: 500000 };
    }

    setBalances(newBalances);
    setCompanyInfo({ ...companyInfo, ...infoUpdates });
  };

  const handleBalanceChange = (code: string, val: string) => {
    setBalances({ ...balances, [code]: parseFloat(val) || 0 });
  };

  const totalAssets = MOCK_CHART_OF_ACCOUNTS
    .filter(a => a.type === 'ASSET')
    .reduce((acc, curr) => acc + (balances[curr.code] || 0), 0);

  const totalLiabilities = MOCK_CHART_OF_ACCOUNTS
    .filter(a => a.type === 'LIABILITY' || a.type === 'EQUITY')
    .reduce((acc, curr) => acc + (balances[curr.code] || 0), 0);

  const isBalanced = Math.abs(totalAssets - totalLiabilities) < 0.01;

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-amber-300" />
          <h4 className="font-bold">智能快速建账</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => applyTemplate('service')} className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 transition-all group">
            <Briefcase size={24} />
            <span className="text-xs font-bold">服务业模板</span>
          </button>
          <button onClick={() => applyTemplate('retail')} className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 transition-all group">
            <ShoppingBag size={24} />
            <span className="text-xs font-bold">贸易业模板</span>
          </button>
          <button onClick={() => applyTemplate('factory')} className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 transition-all group">
            <Factory size={24} />
            <span className="text-xs font-bold">制造业模板</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Building2 className="text-blue-600" size={20} /> 企业基础档案 (UC001)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">企业全称 <span className="text-rose-500">*</span></label>
            <input 
              type="text" required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="请输入工商登记名称"
              value={companyInfo.name}
              onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">企业规模</label>
            <select 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={companyInfo.scale}
              onChange={e => setCompanyInfo({...companyInfo, scale: e.target.value as any})}
            >
              <option value="微型">微型企业 (1-10人)</option>
              <option value="小型">小型企业 (10-50人)</option>
              <option value="中型">中型企业 (50人以上)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">注册资金 (元) <span className="text-rose-500">*</span></label>
            <input 
              type="number" required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={companyInfo.registeredCapital}
              onChange={e => setCompanyInfo({...companyInfo, registeredCapital: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">记账币种</label>
            <select 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
              value={companyInfo.currency}
              onChange={e => setCompanyInfo({...companyInfo, currency: e.target.value})}
            >
              {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings2 className="text-blue-600" size={20} /> 财务参数设置
        </h4>
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 block">会计年度启用月份</label>
          <select 
            className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-200"
            value={companyInfo.fiscalYearStart}
            onChange={e => setCompanyInfo({...companyInfo, fiscalYearStart: e.target.value})}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={`${i+1}`}>每年 {i+1} 月</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 font-medium italic">提示：建立后无法随意更改会计分期起点。</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-blue-600" size={20} /> 期初余额平衡校验 (UC003)
          </h4>
          <div className={`px-4 py-1 rounded-full text-xs font-bold ${isBalanced ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
            {isBalanced ? '借贷已平衡' : `不平衡: 差额 ¥${Math.abs(totalAssets - totalLiabilities).toLocaleString()}`}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {MOCK_CHART_OF_ACCOUNTS.filter(a => ['ASSET', 'LIABILITY', 'EQUITY'].includes(a.type)).map(acc => (
            <div key={acc.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
               <span className="text-sm font-medium text-slate-600">{acc.code} {acc.name}</span>
               <input 
                type="number" 
                className="w-32 text-right px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                value={balances[acc.code] || ''}
                onChange={e => handleBalanceChange(acc.code, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {[1,2,3].map(i => (
          <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-blue-600' : 'text-slate-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= i ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>{i}</div>
            <span className="text-sm font-bold">{i === 1 ? '基础档案' : i === 2 ? '财务参数' : '期初余额'}</span>
          </div>
        ))}
      </div>

      <div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-6 flex justify-center gap-4 z-50">
        <button disabled={step === 1} onClick={() => setStep(step - 1)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all disabled:opacity-0">上一步</button>
        <button onClick={onReset} className="px-8 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2"><RefreshCcw size={18}/> 重置</button>
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">下一步 <ArrowRight size={18}/></button>
        ) : (
          <button onClick={() => { if(!isBalanced) return alert('借贷不平衡'); setCompanyInfo({...companyInfo, isInitialized: true})}} className="px-12 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"><Save size={18}/> 完成建账</button>
        )}
      </div>

      {companyInfo.isInitialized && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur flex items-center justify-center z-[100] animate-in fade-in">
          <div className="bg-white p-12 rounded-[3rem] text-center max-w-lg shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40}/></div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">企业初始化完成</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">您的账务系统已根据 <b>{companyInfo.name}</b> 的档案完成配置。您可以开始记账或进行业务管理。</p>
            <button onClick={() => onNavigate('dashboard')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all">进入财务控制面板</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Initialization;
