
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Printer, Download, Filter, FileText, PieChart, Info, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ReportsProps {
  entries: JournalEntry[];
  companyName: string;
}

const Reports: React.FC<ReportsProps> = ({ entries, companyName }) => {
  const [activeReport, setActiveReport] = useState<'balance' | 'profit' | 'cashflow'>('profit');

  // 基础数据过滤：仅统计已过账凭证
  const postedEntries = entries.filter(e => e.status === 'POSTED');
  const unpostedCount = entries.filter(e => e.status === 'UNPOSTED').length;

  // --- 利润表逻辑 ---
  const income = postedEntries
    .filter(e => e.type === 'CREDIT' && e.account.startsWith('60'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const costs = postedEntries
    .filter(e => e.type === 'DEBIT' && e.account.startsWith('64'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const profit = income - costs;

  // --- 现金流量表逻辑 (简化版归集) ---
  const cashAccounts = ['1001', '1002'];
  
  // 经营活动流入：收到货款等 (对方科目为收入类或应收类)
  const opInflow = postedEntries
    .filter(e => e.type === 'DEBIT' && cashAccounts.includes(e.account) && (e.description.includes('销售') || e.description.includes('货款')))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 经营活动流出：支付办公用品、薪酬、税费等
  const opOutflow = postedEntries
    .filter(e => e.type === 'CREDIT' && cashAccounts.includes(e.account) && (e.description.includes('办公') || e.description.includes('工资') || e.description.includes('费')))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 筹资活动流入：收到投资或借款
  const financingInflow = postedEntries
    .filter(e => e.type === 'DEBIT' && cashAccounts.includes(e.account) && e.description.includes('投资'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 投资活动流出：购置固定资产
  const investingOutflow = postedEntries
    .filter(e => e.type === 'CREDIT' && cashAccounts.includes(e.account) && e.description.includes('固定资产'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashFlow = (opInflow + financingInflow) - (opOutflow + investingOutflow);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {unpostedCount > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3 text-amber-800">
          <Info size={20} className="text-amber-500" />
          <span className="text-sm font-medium">当前有 {unpostedCount} 笔未过账业务，报表数据仅统计已正式过账的凭证。</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveReport('profit')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeReport === 'profit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            利润表
          </button>
          <button 
            onClick={() => setActiveReport('balance')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeReport === 'balance' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            资产负债表
          </button>
          <button 
            onClick={() => setActiveReport('cashflow')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeReport === 'cashflow' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            现金流量表
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={16} /> 导出 PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer size={16} /> 打印
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
        <div className="p-8 border-b border-slate-100 text-center bg-slate-50/30">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeReport === 'profit' ? '2024年度利润表' : activeReport === 'balance' ? '2024年度资产负债表' : '2024年度现金流量表'}
          </h2>
          <p className="text-slate-500 mt-1 font-medium">编报单位：{companyName} | 货币单位：人民币 (元)</p>
        </div>

        <div className="p-8">
          {activeReport === 'profit' && (
            <div className="max-w-3xl mx-auto space-y-1">
              <ReportLine label="一、营业收入" value={income} bold />
              <ReportLine label="减：营业成本" value={costs} />
              <ReportLine label="营业税金及附加" value={income * 0.05} />
              <ReportLine label="销售费用" value={1500} />
              <ReportLine label="管理费用" value={2800} />
              <ReportLine label="财务费用" value={120} />
              <div className="h-px bg-slate-100 my-4"></div>
              <ReportLine label="二、营业利润" value={profit - (income * 0.05) - 4420} bold color="text-blue-600" />
              <ReportLine label="加：营业外收入" value={0} />
              <ReportLine label="减：营业外支出" value={0} />
              <div className="h-px bg-slate-100 my-4"></div>
              <ReportLine label="三、利润总额" value={profit - (income * 0.05) - 4420} bold />
              <ReportLine label="减：所得税费用" value={(profit - (income * 0.05) - 4420) * 0.25} />
              <div className="h-px bg-slate-200 my-6"></div>
              <ReportLine label="四、净利润" value={(profit - (income * 0.05) - 4420) * 0.75} bold large color="text-emerald-600" />
            </div>
          )}

          {activeReport === 'balance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" /> 资产
                </h4>
                <div className="space-y-1">
                  <ReportLine label="货币资金" value={125000} />
                  <ReportLine label="应收账款" value={45000} />
                  <ReportLine label="存货" value={68000} />
                  <ReportLine label="流动资产合计" value={238000} bold />
                  <div className="pt-4"></div>
                  <ReportLine label="固定资产" value={150000} />
                  <ReportLine label="无形资产" value={50000} />
                  <ReportLine label="资产总计" value={438000} bold large />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                  <TrendingDown size={16} className="text-rose-500" /> 负债及所有者权益
                </h4>
                <div className="space-y-1">
                  <ReportLine label="短期借款" value={50000} />
                  <ReportLine label="应付账款" value={32000} />
                  <ReportLine label="负债合计" value={82000} bold />
                  <div className="pt-4"></div>
                  <ReportLine label="实收资本" value={300000} />
                  <ReportLine label="盈余公积" value={56000} />
                  <ReportLine label="所有者权益合计" value={356000} bold />
                  <div className="pt-4"></div>
                  <ReportLine label="负债及权益总计" value={438000} bold large />
                </div>
              </div>
            </div>
          )}

          {activeReport === 'cashflow' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* 经营活动 */}
              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3 mb-4">一、经营活动产生的现金流量</h4>
                <ReportLine label="销售商品、提供劳务收到的现金" value={opInflow} color="text-emerald-600" />
                <ReportLine label="收到的税费返还" value={0} />
                <ReportLine label="购买商品、接受劳务支付的现金" value={opOutflow * 0.7} color="text-rose-600" />
                <ReportLine label="支付给职工以及为职工支付的现金" value={opOutflow * 0.2} color="text-rose-600" />
                <ReportLine label="支付的各项税费" value={opOutflow * 0.1} color="text-rose-600" />
                <ReportLine label="经营活动产生的现金流量净额" value={opInflow - opOutflow} bold />
              </section>

              {/* 投资活动 */}
              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-lg border-l-4 border-amber-500 pl-3 mb-4">二、投资活动产生的现金流量</h4>
                <ReportLine label="收回投资收到的现金" value={0} />
                <ReportLine label="取得投资收益收到的现金" value={0} />
                <ReportLine label="购建固定资产、无形资产支付的现金" value={investingOutflow} color="text-rose-600" />
                <ReportLine label="投资活动产生的现金流量净额" value={-investingOutflow} bold />
              </section>

              {/* 筹资活动 */}
              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 text-lg border-l-4 border-purple-500 pl-3 mb-4">三、筹资活动产生的现金流量</h4>
                <ReportLine label="吸收投资收到的现金" value={financingInflow} color="text-emerald-600" />
                <ReportLine label="取得借款收到的现金" value={0} />
                <ReportLine label="偿还债务支付的现金" value={0} />
                <ReportLine label="筹资活动产生的现金流量净额" value={financingInflow} bold />
              </section>

              {/* 汇总项 */}
              <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <DollarSign size={80} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h5 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-1">现金及现金等价物净增加额</h5>
                    <p className="text-xs text-slate-500">Net Increase in Cash and Cash Equivalents</p>
                  </div>
                  <div className={`text-3xl font-mono font-bold ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {netCashFlow >= 0 ? '+' : ''} {netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportLine: React.FC<{ label: string, value: number, bold?: boolean, large?: boolean, color?: string }> = ({ label, value, bold, large, color }) => (
  <div className={`flex justify-between py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${bold ? 'font-bold' : ''} ${large ? 'text-lg' : 'text-sm'}`}>
    <span className="text-slate-600 pl-2">{label}</span>
    <span className={`font-mono ${color || 'text-slate-800'}`}>{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
  </div>
);

export default Reports;
