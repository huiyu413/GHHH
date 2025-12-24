
export enum AppRole {
  MANAGER = '管理者',
  FINANCE = '财务人员',
  PROCUREMENT = '采购人员',
  SALES = '销售人员',
  EMPLOYEE = '普通员工'
}

export interface CompanyInfo {
  name: string;
  taxId: string;
  legalPerson: string;
  currency: string;
  fiscalYearStart: string;
  scale: '微型' | '小型' | '中型'; // UC001 新增
  registeredCapital: number;     // UC001 新增
  isInitialized: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  currency: string;
  status: 'UNPOSTED' | 'POSTED';
  isReconciled?: boolean;
}

// 模拟会计凭证（一组分录）
export interface Voucher {
  id: string;
  date: string;
  entries: JournalEntry[];
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  creditLimit: number;
  balance: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; price: number }[];
  taxRate: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
}

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  category: '交通' | '餐饮' | '住宿' | '其他';
  amount: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: '原材料' | '办公用品' | '外包服务' | '固定资产';
  status: 'ACTIVE' | 'ARCHIVED';
  balance: number;
  creditLimit: number; // UC010 新增
}

export interface Order {
  id: string;
  supplierId: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
}

export interface BankStatementItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'IN' | 'OUT';
  isMatched?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: AppRole[];
}
