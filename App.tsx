
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppRole, JournalEntry, Supplier, Order, CompanyInfo, Customer, Invoice, ExpenseClaim, ChartOfAccount } from './types';
import { MOCK_JOURNAL_ENTRIES, MOCK_SUPPLIERS, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_EXPENSES, MOCK_CHART_OF_ACCOUNTS } from './constants';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import Posting from './pages/Posting';
import Initialization from './pages/Initialization';
import Reconciliation from './pages/Reconciliation';
import Currency from './pages/Currency';
import Settings from './pages/Settings';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Taxation from './pages/Taxation';
import COA from './pages/COA';
import GeneralLedger from './pages/GeneralLedger';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<AppRole>(AppRole.FINANCE);
  
  const getInitialData = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => 
    // Fix: added missing properties 'scale' and 'registeredCapital' to match CompanyInfo interface (Error in file App.tsx on line 32)
    getInitialData('companyInfo', {
      name: 'MicroFin 演示公司',
      taxId: '91440300MA5XXXXXXX',
      legalPerson: '张经理',
      currency: 'CNY',
      fiscalYearStart: '1',
      scale: '微型',
      registeredCapital: 0,
      isInitialized: false
    })
  );

  const [coa, setCoa] = useState<ChartOfAccount[]>(() => getInitialData('coa', MOCK_CHART_OF_ACCOUNTS));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => getInitialData('journalEntries', MOCK_JOURNAL_ENTRIES));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getInitialData('suppliers', MOCK_SUPPLIERS));
  const [customers, setCustomers] = useState<Customer[]>(() => getInitialData('customers', MOCK_CUSTOMERS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialData('invoices', MOCK_INVOICES));
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(() => getInitialData('expenses', MOCK_EXPENSES));
  const [orders, setOrders] = useState<Order[]>(() => getInitialData('orders', MOCK_ORDERS));

  useEffect(() => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    localStorage.setItem('coa', JSON.stringify(coa));
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [companyInfo, coa, journalEntries, suppliers, customers, invoices, expenses]);

  const handleResetSystem = () => {
    if (confirm('警告：此操作将永久清空所有账套数据。确定要重置吗？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (!companyInfo.isInitialized && activeTab !== 'initialization') {
      setActiveTab('initialization');
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard role={role} entries={journalEntries} companyName={companyInfo.name} />;
      case 'initialization': return <Initialization companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} onNavigate={setActiveTab} onReset={handleResetSystem} />;
      case 'journal': return <Journal entries={journalEntries} setEntries={setJournalEntries} coa={coa} />;
      case 'coa': return <COA coa={coa} setCoa={setCoa} />;
      case 'posting': return <Posting entries={journalEntries} setEntries={setJournalEntries} />;
      case 'ledger': return <GeneralLedger entries={journalEntries} coa={coa} />;
      case 'taxation': return <Taxation entries={journalEntries} />;
      case 'reconciliation': return <Reconciliation entries={journalEntries} setEntries={setJournalEntries} />;
      case 'currency': return <Currency />;
      case 'reports': return <Reports entries={journalEntries} companyName={companyInfo.name} />;
      case 'customers': return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'invoices': return <Invoices invoices={invoices} customers={customers} />;
      case 'suppliers': return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'orders': return <Orders orders={orders} suppliers={suppliers} />;
      case 'expenses': return <Expenses expenses={expenses} setExpenses={setExpenses} role={role} />;
      case 'settings': return <Settings companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} onReset={handleResetSystem} />;
      default: return <div className="p-8">模块建设中...</div>;
    }
  };

  return (
    <Layout activeId={activeTab} onNavigate={setActiveTab} currentRole={role} onRoleChange={setRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
