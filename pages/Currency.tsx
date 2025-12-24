
import React, { useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, MOCK_JOURNAL_ENTRIES } from '../constants';
import { 
  Globe, 
  RefreshCw, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  AlertCircle,
  FileText,
  Zap
} from 'lucide-react';

const Currency: React.FC = () => {
  const [rates, setRates] = useState(SUPPORTED_CURRENCIES);
  const [isUpdating, setIsUpdating] = useState(false);
  const [converterData, setConverterData] = useState({ amount: 100, from: 'USD', to: 'CNY' });
  const [convertedValue, setConvertedValue] = useState(0);

  // 模拟外币账户余额
  const foreignBalances = [
    { currency: 'USD', account: '100201 - 美元基本户', balance: 12500.50, originalRate: 7.15 },
    { currency: 'HKD', account: '100202 - 港元结算户', balance: 88400.00, originalRate: 0.91 },
    { currency: 'EUR', account: '112201 - 应收欧元账款', balance: 5600.00, originalRate: 7.75 },
  ];

  // 转换计算
  useEffect(() => {
    const fromRate = rates.find(r => r.code === converterData.from)?.rateToCny || 1;
    const toRate = rates.find(r => r.code === converterData.to)?.rateToCny || 1;
    const result = (converterData.amount * fromRate) / toRate;
    setConvertedValue(result);
  }, [converterData, rates]);

  const updateRates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const newRates = rates.map(r => ({
        ...r,
        rateToCny: r.code === 'CNY' ? 1 : r.rateToCny * (1 + (Math.random() * 0.02 - 0.01))
      }));
      setRates(newRates);
      setIsUpdating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Exchange Rate Grid */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">全球汇率中心</h3>
          <p className="text-sm text-slate-500 font-medium">基准币种：人民币 (CNY)</p>
        </div>
        <button 
          onClick={updateRates}
          disabled={isUpdating}
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
          同步最新汇率
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {rates.map(currency => (
          <div key={currency.code} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {currency.symbol}
              </span>
              <span className="text-xs font-bold text-slate-400">{currency.code}</span>
            </div>
            <p className="text-2xl font-mono font-bold text-slate-800">
              {currency.rateToCny.toFixed(4)}
            </p>
            <p className="text-[10px] text-slate-400 uppercase mt-1">1 {currency.code} = {currency.rateToCny.toFixed(4)} CNY</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <TrendingUp size={12} />
              +0.12%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Currency Converter */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <ArrowRightLeft size={20} />
            </div>
            <h4 className="text-lg font-bold text-slate-800">汇率计算器</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">原始金额</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  value={converterData.amount}
                  onChange={(e) => setConverterData({...converterData, amount: parseFloat(e.target.value) || 0})}
                />
                <select 
                  className="absolute right-2 top-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold px-2 py-1.5 focus:ring-0"
                  value={converterData.from}
                  onChange={(e) => setConverterData({...converterData, from: e.target.value})}
                >
                  {rates.map(r => <option key={r.code} value={r.code}>{r.code}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-2 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
                <ArrowRightLeft size={16} className="rotate-90" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">转换结果</label>
              <div className="relative">
                <div className="w-full px-4 py-3 bg-blue-50 rounded-xl text-lg font-bold text-blue-600">
                  {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                <select 
                  className="absolute right-2 top-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold px-2 py-1.5 focus:ring-0"
                  value={converterData.to}
                  onChange={(e) => setConverterData({...converterData, to: e.target.value})}
                >
                  {rates.map(r => <option key={r.code} value={r.code}>{r.code}</option>)}
                </select>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-3">
              <Zap size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                当前为即时参考汇率，实际记账将采用凭证发生时的设定汇率。
              </p>
            </div>
          </div>
        </div>

        {/* Foreign Currency Revaluation */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <Calculator size={20} className="text-emerald-500" />
              期末汇兑损益评估 (期末调汇)
            </h4>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                <FileText size={18} />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase">币种账户</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase text-right">账面余额 (原币)</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase text-right">原账面汇率</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase text-right">最新现汇价</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase text-right">潜在损益</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {foreignBalances.map((item, idx) => {
                    const currentRate = rates.find(r => r.code === item.currency)?.rateToCny || 1;
                    const originalCny = item.balance * item.originalRate;
                    const currentCny = item.balance * currentRate;
                    const profitLoss = currentCny - originalCny;
                    
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <p className="text-sm font-bold text-slate-800">{item.currency}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{item.account}</p>
                        </td>
                        <td className="py-4 text-right font-mono text-sm font-medium text-slate-600">
                          {item.balance.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-mono text-xs text-slate-400">
                          {item.originalRate.toFixed(4)}
                        </td>
                        <td className="py-4 text-right font-mono text-xs text-blue-600 font-bold">
                          {currentRate.toFixed(4)}
                        </td>
                        <td className={`py-4 text-right font-mono text-sm font-bold ${profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h5 className="text-white font-bold mb-1">预估累计汇兑收益 (CNY)</h5>
                  <p className="text-slate-400 text-xs font-medium">系统建议生成“财务费用 - 汇兑损益”凭证</p>
                </div>
                <div className="text-3xl font-mono font-bold text-emerald-400">
                  + 2,845.22
                </div>
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Globe size={100} className="text-white" />
              </div>
            </div>

            <button className="mt-6 w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
              <RefreshCw size={18} />
              生成期末调汇凭证
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
