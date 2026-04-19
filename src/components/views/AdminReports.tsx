import { Wallet, Receipt, GraduationCap, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PayrollReport from '@/components/reports/PayrollReport';
import TuitionReport from '@/components/reports/TuitionReport';
import AcademicReport from '@/components/reports/AcademicReport';
import AttendanceReport from '@/components/reports/AttendanceReport';
import AdminFinance from './AdminFinance';

const AdminReports = () => (
  <div className="space-y-4">
    <Tabs defaultValue="payroll">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="payroll" className="gap-2"><Wallet className="h-4 w-4" /> Báo cáo Lương</TabsTrigger>
        <TabsTrigger value="tuition" className="gap-2"><Receipt className="h-4 w-4" /> Báo cáo Học phí</TabsTrigger>
        <TabsTrigger value="academic" className="gap-2"><GraduationCap className="h-4 w-4" /> Kết quả học tập</TabsTrigger>
        <TabsTrigger value="attendance" className="gap-2"><ClipboardCheck className="h-4 w-4" /> Điểm danh</TabsTrigger>
        <TabsTrigger value="finance" className="gap-2"><ShieldCheck className="h-4 w-4" /> Phê duyệt tài chính</TabsTrigger>
      </TabsList>
      <TabsContent value="payroll" className="mt-4"><PayrollReport /></TabsContent>
      <TabsContent value="tuition" className="mt-4"><TuitionReport /></TabsContent>
      <TabsContent value="academic" className="mt-4"><AcademicReport /></TabsContent>
      <TabsContent value="attendance" className="mt-4"><AttendanceReport /></TabsContent>
      <TabsContent value="finance" className="mt-4"><AdminFinance /></TabsContent>
    </Tabs>
  </div>
);

export default AdminReports;
