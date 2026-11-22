import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  Download,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Filter,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentReportRow {
  rollNo: string;
  name: string;
  department: string;
  cgpa: number;
  passId: string;
  status: 'Placed' | 'Available';
  company?: string;
  packageLpa?: number;
}

export const PlacementReports: React.FC = () => {
  const { studentProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Master records list
  const masterData: StudentReportRow[] = useMemo(() => {
    return [
      {
        rollNo: studentProfile?.rollNumber || '21CS084',
        name: studentProfile?.fullName || 'Alex Chen',
        department: studentProfile?.department || 'Computer Science & Engineering',
        cgpa: studentProfile?.cgpa || 8.85,
        passId: studentProfile?.placementPassId || 'HP-2025-CS-084-VERIFIED',
        status: 'Placed',
        company: 'Atlassian',
        packageLpa: 29.5,
      },
      {
        rollNo: '21CS002',
        name: 'Aarav Patel',
        department: 'Computer Science & Engineering',
        cgpa: 9.42,
        passId: 'HP-2025-CS-002-VERIFIED',
        status: 'Placed',
        company: 'Google',
        packageLpa: 34.0,
      },
      {
        rollNo: '21IT015',
        name: 'Priya Sharma',
        department: 'Information Technology',
        cgpa: 9.12,
        passId: 'HP-2025-IT-015-VERIFIED',
        status: 'Placed',
        company: 'Microsoft',
        packageLpa: 26.0,
      },
      {
        rollNo: '21EC045',
        name: 'Aisha Siddiqui',
        department: 'Electronics & Communication',
        cgpa: 8.92,
        passId: 'HP-2025-EC-045-VERIFIED',
        status: 'Placed',
        company: 'Uber',
        packageLpa: 35.0,
      },
      {
        rollNo: '21CS112',
        name: 'Rohan Verma',
        department: 'Computer Science & Engineering',
        cgpa: 8.64,
        passId: 'HP-2025-CS-112-VERIFIED',
        status: 'Available',
      },
      {
        rollNo: '21EE038',
        name: 'Meera Nambiar',
        department: 'Electrical & Electronics',
        cgpa: 8.41,
        passId: 'HP-2025-EE-038-VERIFIED',
        status: 'Placed',
        company: 'Cisco',
        packageLpa: 18.0,
      },
      {
        rollNo: '21ME022',
        name: 'Karthik Rao',
        department: 'Mechanical Engineering',
        cgpa: 8.15,
        passId: 'HP-2025-ME-022-VERIFIED',
        status: 'Placed',
        company: 'Tata Motors',
        packageLpa: 11.5,
      },
      {
        rollNo: '21IT089',
        name: 'Devika Pillai',
        department: 'Information Technology',
        cgpa: 8.78,
        passId: 'HP-2025-IT-089-VERIFIED',
        status: 'Placed',
        company: 'Razorpay',
        packageLpa: 21.0,
      },
      {
        rollNo: '21CS143',
        name: 'Tanya Sengupta',
        department: 'Computer Science & Engineering',
        cgpa: 8.52,
        passId: 'HP-2025-CS-143-VERIFIED',
        status: 'Available',
      },
      {
        rollNo: '21CE019',
        name: 'Arjun Das',
        department: 'Civil Engineering',
        cgpa: 7.92,
        passId: 'HP-2025-CE-019-VERIFIED',
        status: 'Placed',
        company: 'L&T Infotech',
        packageLpa: 8.2,
      },
    ];
  }, [studentProfile]);

  const filteredData = useMemo(() => {
    return masterData.filter((row) => {
      if (selectedDept !== 'All' && row.department !== selectedDept) return false;
      if (selectedStatus !== 'All' && row.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.name.toLowerCase().includes(q) ||
          row.rollNo.toLowerCase().includes(q) ||
          (row.company && row.company.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [masterData, selectedDept, selectedStatus, searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Candidate Name',
      'Department',
      'CGPA',
      'Placement Pass ID',
      'Status',
      'Placed Company',
      'Package (LPA)',
    ];

    const rows = filteredData.map((r) => [
      r.rollNo,
      `"${r.name}"`,
      `"${r.department}"`,
      r.cgpa,
      r.passId,
      r.status,
      `"${r.company || 'N/A'}"`,
      r.packageLpa || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hirepath_placement_master_report_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Official Master Placement Report exported as CSV');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Official Placement Audit & Master Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export accredited student placement registers for university governance, NIRF, and NAAC committees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Master CSV
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Input
            placeholder="Search candidate name, roll no, or company..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Placed">Placed Candidates</option>
            <option value="Available">Available for Placement</option>
          </select>
        </div>
      </div>

      {/* Master Table */}
      <Card glass>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm">Graduating Cohort Register</CardTitle>
            <p className="text-xs text-slate-500">
              Showing {filteredData.length} records matching current criteria
            </p>
          </div>
          <Badge variant="brand">Verified Academic Records</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold uppercase">Roll No</th>
                  <th className="p-3.5 font-bold uppercase">Student Name</th>
                  <th className="p-3.5 font-bold uppercase">Department</th>
                  <th className="p-3.5 font-bold uppercase">CGPA</th>
                  <th className="p-3.5 font-bold uppercase">Pass ID</th>
                  <th className="p-3.5 font-bold uppercase">Status</th>
                  <th className="p-3.5 font-bold uppercase">Placed Company</th>
                  <th className="p-3.5 font-bold uppercase text-right">Package (LPA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredData.map((row) => (
                  <tr
                    key={row.rollNo}
                    className="hover:bg-slate-50/50 dark:hover:bg-navy-800/40 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {row.rollNo}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {row.department}
                    </td>
                    <td className="p-3.5 font-extrabold text-emerald-600">
                      {row.cgpa.toFixed(2)}
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-indigo-400">
                      {row.passId}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={row.status === 'Placed' ? 'success' : 'default'}
                        size="sm"
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {row.company || '—'}
                    </td>
                    <td className="p-3.5 font-extrabold text-right text-emerald-600 dark:text-emerald-400">
                      {row.packageLpa ? `${row.packageLpa} LPA` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
