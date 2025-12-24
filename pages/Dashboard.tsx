
import React, { useState, useEffect } from 'react';
import { AppRole, JournalEntry } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, Wallet, DollarSign, Activity, Building } from 'lucide-react';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  role: AppRole;
  entries: JournalEntry[];
  companyName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, entries, companyName }) => {
  const [aiInsight, setAiInsight] = useState<string>('正在利用 AI 分析您的财务数据...');

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getFinancialInsights(entries.slice(0, 5));
      setAiInsight(insight);
    };
    fetchInsight();
  }, [entries]);

  const income = entries
    .filter(e => e.type === 'DEBIT' && (e.account === '1001' || e.account === '1002'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = entries
    .filter(e => e.type === 'CREDIT' && (e.account === '1001' || e.account === '1002'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const data = [
    { name: '1月', income: 45000, expense: 32000 },
    { name: '2月', income: 52000, expense: 38000 },
    { name: '3月', income: income, expense: expense },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Building className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{companyName}</h2>
          <p className="text-sm text-slate-500 font-medium">欢迎回来，这是您的财务健康概览</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">账户余额</p>
              <h3 className="text-2xl font-bold text-slate-800">¥{(income - expense).toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
            <TrendingUp size={16} />
            <span>较上月 +12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月总收入</p>
              <h3 className="text-2xl font-bold text-slate-800">¥{income.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
            <TrendingUp size={16} />
            <span>符合预期</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月总支出</p>
              <h3 className="text-2xl font-bold text-slate-800">¥{expense.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-rose-500 text-sm font-medium">
            <Activity size={16} />
            <span>下降 4.2%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">待处理订单</p>
              <h3 className="text-2xl font-bold text-slate-800">12</h3>
            </div>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            需采购部跟进
          </div>
        </div>
      </div>

      {/* Charts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">收支趋势分析</h3>
            <select className="text-sm border-slate-200 rounded-lg">
              <option>最近三月</option>
              <option>本年度</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="收入" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} name="支出" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-amber-300" size={24} />
              <h3 className="text-xl font-bold">AI 财务智能分析</h3>
            </div>
            <div className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <p className="text-sm leading-relaxed text-indigo-50">
                {aiInsight}
              </p>
            </div>
            <button className="mt-8 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-md">
              查看完整报告
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">常用业务入口</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: '新增凭证', color: 'bg-blue-50 text-blue-600' },
            { label: '银行对账', color: 'bg-emerald-50 text-emerald-600' },
            { label: '资产负债表', color: 'bg-amber-50 text-amber-600' },
            { label: '利润表', color: 'bg-purple-50 text-purple-600' },
            { label: '外币调整', color: 'bg-rose-50 text-rose-600' },
            { label: '税务申报', color: 'bg-indigo-50 text-indigo-600' },
          ].map((action, i) => (
            <button key={i} className={`${action.color} p-4 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity text-center`}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
