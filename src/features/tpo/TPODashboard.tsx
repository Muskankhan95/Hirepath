import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_PLACEMENT_STATS, MOCK_PLACEMENT_TREND, MOCK_BRANCH_STATS } from '../../data/mockData';
import { Link } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

export const TPODashboard: React.FC = () => {
  const { approvals, jobDrives } = useAuth();
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* TPO Command Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-950 via-navy-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Central Placement Cell • 2024 - 2025 Season
              </span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Accredited Tier-1 Status
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Apex Institute Placement Command Center
            </h1>
            <p className="mt-1 text-sm text-indigo-200 max-w-xl">
              Real-time governance over company campus drives, eligibility thresholds, student digital passes, and accreditation analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/tpo/approvals">
              <Button
                variant={pendingCount > 0 ? 'gradient' : 'secondary'}
                size="md"
                leftIcon={<ShieldAlert className="w-4 h-4 text-amber-300" />}
                className="shadow-lg"
              >
                Approval Queue ({pendingCount})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Placement Rate</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {MOCK_PLACEMENT_STATS.placementPercentage}%
              </span>
              <span className="text-xs text-slate-500">
                {MOCK_PLACEMENT_STATS.placedStudents}/{MOCK_PLACEMENT_STATS.registeredStudents}
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Highest Package</span>
              <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {MOCK_PLACEMENT_STATS.highestPackage} LPA
              </span>
              <span className="text-xs font-semibold text-violet-600">Super Dream</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Average Package</span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {MOCK_PLACEMENT_STATS.averagePackage} LPA
              </span>
              <span className="text-xs text-slate-500">Median {MOCK_PLACEMENT_STATS.medianPackage}</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Offers</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {MOCK_PLACEMENT_STATS.totalOffers}
              </span>
              <span className="text-xs text-slate-500">{MOCK_PLACEMENT_STATS.totalCompanies} Companies</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Grid: Recharts Placement Velocity Trend + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Recharts Offer Velocity Trend */}
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-500" />
                  Monthly Offer Issuance Velocity (2024-2025)
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Cumulative offers accepted vs. monthly placement drives conducted
                </p>
              </div>
              <Badge variant="brand">Live Campus Trend</Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_PLACEMENT_TREND}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="offersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      stroke="#888888"
                      fontSize={11}
                    />
                    <YAxis tickLine={false} stroke="#888888" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#offersGradient)"
                      name="Cumulative Offers"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Placement Breakdown Mini Table */}
          <Card glass>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm">Departmental Placement Rates</CardTitle>
                <p className="text-xs text-slate-500">Branch-wise placement percentages and average packages</p>
              </div>
              <Link to="/tpo/analytics">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Full Analytics
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3 font-bold uppercase">Department</th>
                      <th className="p-3 font-bold uppercase">Eligible</th>
                      <th className="p-3 font-bold uppercase">Placed</th>
                      <th className="p-3 font-bold uppercase">Percentage</th>
                      <th className="p-3 font-bold uppercase">Avg CTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_BRANCH_STATS.slice(0, 4).map((b) => (
                      <tr key={b.branch} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{b.branch}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{b.total}</td>
                        <td className="p-3 font-semibold text-emerald-600">{b.placed}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{b.percentage}%</td>
                        <td className="p-3 font-bold text-brand-600 dark:text-brand-400">{b.avgCtc} LPA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Approval Queue Alert Widget */}
        <div className="space-y-6">
          <Card className="border-amber-500/40 bg-gradient-to-b from-white to-amber-50/30 dark:from-navy-900 dark:to-amber-950/20 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Compliance Verification
                </span>
                <Badge variant="warning">{pendingCount} Actionable</Badge>
              </div>
              <CardTitle className="text-base mt-2">
                TPO Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {approvals
                .filter((a) => a.status === 'pending')
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">By: {item.submittedBy}</p>
                  </div>
                ))}

              <Link to="/tpo/approvals" className="block pt-1">
                <Button variant="primary" size="sm" className="w-full">
                  Open Approval Desk
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Reports Link */}
          <Card glass className="p-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Accreditation & NAAC Reports
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Generate student placement audit sheets, offer validation lists, and company visit logs.
            </p>
            <Link to="/tpo/reports">
              <Button variant="outline" size="sm" className="w-full">
                Download Master CSV Reports
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
