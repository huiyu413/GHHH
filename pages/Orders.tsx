
import React from 'react';
import { Order, Supplier } from '../types';
import { ClipboardList, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface OrdersProps {
  orders: Order[];
  suppliers: Supplier[];
}

const Orders: React.FC<OrdersProps> = ({ orders, suppliers }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> 已完成</span>;
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> 处理中</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> 已取消</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">订单跟踪</h3>
        <button className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-lg">
          <ClipboardList size={20} />
          新建采购订单
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">订单编号</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">供应商</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">下单日期</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">订单金额</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(order => {
              const supplier = suppliers.find(s => s.id === order.supplierId);
              return (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{supplier?.name || '未知供应商'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">¥{order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
