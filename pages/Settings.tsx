
import React, { useState } from 'react';
import { CompanyInfo } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  FileJson, 
  Globe, 
  Save, 
  AlertTriangle,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  RefreshCcw
} from 'lucide-react';

interface SettingsProps {
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  onReset: () => void; // 新增：重置回调
}

const Settings: React.FC<SettingsProps> = ({ companyInfo, setCompanyInfo, onReset }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'accounting' | 'tax' | 'security' | 'danger'>('profile');
  const [localInfo, setLocalInfo] = useState<CompanyInfo>(companyInfo);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setCompanyInfo(localInfo);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const menuItems = [
    { id: 'profile', label: '企业档案', icon: <Building2 size={18} /> },
    { id: 'accounting', label: '财务准则', icon: <FileJson size={18} /> },
    { id: 'tax', label: '税务配置', icon: <Globe size={18} /> },
    { id: 'security', label: '权限与安全', icon: <ShieldCheck size={18} /> },
    { id: 'danger', label: '危险区域', icon: <AlertTriangle size={18} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      <aside className="w-full lg:w-64 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as any)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              activeSection === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <ChevronRight size={14} className={activeSection === item.id ? 'opacity-100' : 'opacity-0'} />
          </button>
        ))}
      </aside>

      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {menuItems.find(m => m.id === activeSection)?.label}
              </h3>
            </div>
            {isSaved && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                <CheckCircle2 size={16} /> 设置已成功保存
              </div>
            )}
          </div>

          <div className="p-8">
            {activeSection === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">企业全称</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      value={localInfo.name}
                      onChange={e => setLocalInfo({...localInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">统一社会信用代码</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                      value={localInfo.taxId}
                      onChange={e => setLocalInfo({...localInfo, taxId: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'accounting' && (
              <div className="space-y-8 max-w-2xl">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    核心财务参数在年度结账期间不可更改。当前处于 <span className="font-bold">2024 会计年度</span>。
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'danger' && (
              <div className="space-y-6">
                <div className="p-8 border-2 border-dashed border-rose-100 rounded-[2rem] bg-rose-50/30">
                  <div className="flex items-start gap-5 mb-8">
                    <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                      <RefreshCcw size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-700 text-xl">系统深度重置 (反初始化)</h4>
                      <p className="text-sm text-rose-600 opacity-80 mt-1">此操作将永久清空账套内所有凭证、客户、供应商资料，并将企业恢复至“未初始化”状态。请务必谨慎操作！</p>
                    </div>
                  </div>
                  <button 
                    onClick={onReset}
                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-3"
                  >
                    <AlertTriangle size={20} />
                    确认重置所有数据
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeSection !== 'danger' && (
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={handleSave}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg"
              >
                <Save size={18} />
                保存设置
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
              <Lock className="text-blue-400" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">数据合规性说明</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                MicroFin 严格遵守财务管理合规要求。数据重置后不可恢复，建议定期导出 PDF 报表作为离线存档。
              </p>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
