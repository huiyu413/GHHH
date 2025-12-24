
import React, { useState } from 'react';
import { Supplier } from '../types';
import { 
  UserPlus, Mail, Phone, Search, Edit, Trash2, Filter, X, AlertCircle, ShieldAlert 
} from 'lucide-react';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '', contact: '', phone: '', email: '', category: '原材料', status: 'ACTIVE', balance: 0, creditLimit: 100000
  });

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // UC010: 唯一性校验
    if (!editingSupplier && suppliers.some(s => s.name === formData.name)) {
      return alert('该供应商名称已存在，请勿重复创建。');
    }

    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...formData } as Supplier : s));
    } else {
      const newSupplier: Supplier = {
        ...formData as Supplier,
        id: `S${Math.floor(Math.random() * 900) + 100}`,
      };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索供应商 (UC010)..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={() => { setShowModal(true); setEditingSupplier(null); }} className="bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700">
          <UserPlus size={20} /> 新增供应商
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.filter(s => s.name.includes(searchQuery)).map(supplier => (
          <div key={supplier.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-xl transition-all relative">
            {supplier.balance > supplier.creditLimit && (
              <div className="absolute -top-3 left-8 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg animate-bounce">
                <ShieldAlert size={12}/> 信用超标 (UC011)
              </div>
            )}
            <div className="flex justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">{supplier.name[0]}</div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{supplier.id}</span>
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-4">{supplier.name}</h4>
            <div className="space-y-2 mb-8 text-slate-500 text-sm">
              <p className="flex items-center gap-2"><Phone size={14}/> {supplier.phone}</p>
              <p className="flex items-center gap-2"><Mail size={14}/> {supplier.email}</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">应付余额</p>
                <p className="text-xl font-black text-slate-900">¥{supplier.balance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">信用限额</p>
                <p className="text-sm font-bold text-slate-500">¥{supplier.creditLimit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">供应商档案配置</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleAddOrUpdate} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">供应商全称</label>
                <input type="text" required className="w-full px-4 py-3 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">信用限额 (UC011)</label>
                  <input type="number" required className="w-full px-4 py-3 rounded-2xl border bg-slate-50" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">业务分类</label>
                  <select className="w-full px-4 py-3 rounded-2xl border bg-slate-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="原材料">原材料</option>
                    <option value="办公用品">办公用品</option>
                    <option value="外包服务">外包服务</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:shadow-blue-100 transition-all">保存供应商资料</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
