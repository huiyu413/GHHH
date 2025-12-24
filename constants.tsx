
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Settings, 
  Receipt, 
  RefreshCw,
  Landmark,
  Coins,
  Contact2,
  FileSpreadsheet,
  WalletCards,
  Percent,
  ListTree,
  TableProperties
} from 'lucide-react';
import { AppRole, NavItem, ChartOfAccount, JournalEntry, Supplier, Order, Customer, Invoice, ExpenseClaim, BankStatementItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard size={20} />, roles: [AppRole.MANAGER, AppRole.FINANCE, AppRole.PROCUREMENT, AppRole.SALES, AppRole.EMPLOYEE] },
  { id: 'initialization', label: '企业初始化', icon: <Landmark size={20} />, roles: [AppRole.FINANCE] },
  { id: 'coa', label: '会计科目表', icon: <ListTree size={20} />, roles: [AppRole.FINANCE] },
  { id: 'journal', label: '凭证管理', icon: <BookOpen size={20} />, roles: [AppRole.FINANCE] },
  { id: 'posting', label: '过账处理', icon: <RefreshCw size={20} />, roles: [AppRole.FINANCE, AppRole.PROCUREMENT, AppRole.SALES] },
  { id: 'ledger', label: '总账/明细账', icon: <TableProperties size={20} />, roles: [AppRole.FINANCE, AppRole.MANAGER] },
  { id: 'reports', label: '会计报表', icon: <BarChart3 size={20} />, roles: [AppRole.MANAGER, AppRole.FINANCE] },
  { id: 'taxation', label: '税务处理', icon: <Percent size={20} />, roles: [AppRole.FINANCE] },
  { id: 'reconciliation', label: '对账业务', icon: <Receipt size={20} />, roles: [AppRole.FINANCE] },
  { id: 'currency', label: '多货币处理', icon: <Coins size={20} />, roles: [AppRole.FINANCE] },
  { id: 'customers', label: '客户管理', icon: <Contact2 size={20} />, roles: [AppRole.SALES, AppRole.MANAGER] },
  { id: 'invoices', label: '销售单(Invoice)', icon: <FileSpreadsheet size={20} />, roles: [AppRole.SALES] },
  { id: 'suppliers', label: '供应商管理', icon: <Users size={20} />, roles: [AppRole.PROCUREMENT, AppRole.FINANCE] },
  { id: 'orders', label: '订单管理', icon: <ShoppingCart size={20} />, roles: [AppRole.PROCUREMENT] },
  { id: 'expenses', label: '费用报销', icon: <WalletCards size={20} />, roles: [AppRole.EMPLOYEE, AppRole.FINANCE] },
  { id: 'settings', label: '系统设置', icon: <Settings size={20} />, roles: [AppRole.MANAGER, AppRole.FINANCE] },
];
// ... 保持其他 mock 数据不变
export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', name: '阿里巴巴(中国)网络技术有限公司', contact: '马经理', phone: '0571-88888888', email: 'service@alibaba.com', creditLimit: 500000, balance: 125000 },
  { id: 'C002', name: '腾讯科技(深圳)有限公司', contact: '马化腾', phone: '0755-99999999', email: 'service@tencent.com', creditLimit: 800000, balance: 0 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV202403001', customerId: 'C001', date: '2024-03-01', dueDate: '2024-03-31', status: 'PAID', taxRate: 0.13, items: [{ description: '软件咨询服务', quantity: 1, price: 50000 }] },
  { id: 'INV202403002', customerId: 'C002', date: '2024-03-15', dueDate: '2024-04-15', status: 'SENT', taxRate: 0.13, items: [{ description: '服务器租赁', quantity: 10, price: 2000 }] },
];

export const MOCK_EXPENSES: ExpenseClaim[] = [
  { id: 'EXP001', employeeId: 'EMP101', employeeName: '小王', date: '2024-03-10', category: '餐饮', amount: 285, description: '加班餐费报销', status: 'PENDING' },
  { id: 'EXP002', employeeId: 'EMP102', employeeName: '小张', date: '2024-03-12', category: '交通', amount: 150, description: '打车去客户现场', status: 'APPROVED' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  // Fix: added creditLimit to match Supplier interface (Error in file constants.tsx on line 58)
  { id: 'S001', name: '晨光文具股份有限公司', contact: '张销售', phone: '021-12345678', email: 'sales@chenguang.com', category: '办公用品', status: 'ACTIVE', balance: 1200, creditLimit: 5000 },
  // Fix: added creditLimit to match Supplier interface (Error in file constants.tsx on line 59)
  { id: 'S002', name: '英特尔(中国)有限公司', contact: 'Li Manager', phone: '010-88888888', email: 'contact@intel.cn', category: '原材料', status: 'ACTIVE', balance: 45000, creditLimit: 100000 },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'PO202403001', supplierId: 'S001', date: '2024-03-05', amount: 3500, status: 'COMPLETED' },
  { id: 'PO202403002', supplierId: 'S002', date: '2024-03-10', amount: 88000, status: 'PENDING' },
];

export const MOCK_BANK_STATEMENTS: BankStatementItem[] = [
  { id: 'B001', date: '2024-03-01', description: '收到销售货款', amount: 50000, type: 'IN', isMatched: false },
  { id: 'B002', date: '2024-03-05', description: '支付办公用品费', amount: 1500, type: 'OUT', isMatched: false },
  { id: 'B003', date: '2024-03-10', description: '利息收入', amount: 24.5, type: 'IN', isMatched: false },
];

export const COMMON_SUMMARIES = [
  '销售商品收入', '收到客户货款', '支付供应商货款', '报销办公费', '发放员工工资', '缴纳增值税', '银行手续费', '计提累计折旧'
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { code: '1001', name: '库存现金', type: 'ASSET' },
  { code: '1002', name: '银行存款', type: 'ASSET' },
  { code: '1122', name: '应收账款', type: 'ASSET' },
  { code: '1405', name: '库存商品', type: 'ASSET' },
  { code: '2202', name: '应付账款', type: 'LIABILITY' },
  { code: '2221', name: '应交税费', type: 'LIABILITY' },
  { code: '4001', name: '实收资本', type: 'EQUITY' },
  { code: '6001', name: '主营业务收入', type: 'REVENUE' },
  { code: '6401', name: '主营业务成本', type: 'EXPENSE' },
  { code: '6602', name: '管理费用', type: 'EXPENSE' },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  { id: '1', date: '2024-03-01', description: '销售产品收入', account: '1002', amount: 50000, type: 'DEBIT', currency: 'CNY', status: 'POSTED' },
  { id: '2', date: '2024-03-01', description: '主营业务收入', account: '6001', amount: 50000, type: 'CREDIT', currency: 'CNY', status: 'POSTED' },
];

export const SUPPORTED_CURRENCIES = [
  { code: 'CNY', name: '人民币', symbol: '¥', rateToCny: 1 },
  { code: 'USD', name: '美元', symbol: '$', rateToCny: 7.24 },
];
