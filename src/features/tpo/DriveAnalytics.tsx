import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  MOCK_BRANCH_STATS,
  MOCK_SALARY_DISTRIBUTION,
  MOCK_PLACEMENT_STATS,
} from '../../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Download, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';

export const DriveAnalytics: React.FC = () => {
  const [batch, setBatch] = useState('2025');

  const ROLE_DISTRIBUTION = [
    { name: 'Software Engineering', value: 420, color: '#6366f1' },
    { name: 'Cloud & DevOps', value: 140, color: '#8b5cf6' },
    { name: 'Data Science & AI', value: 95, color: '#ec4899' },
    { name: 'Core & Embedded', value: 71, color: '#10b981' },
  ];

  const handleExport = () => {
    toast.success('Analytics dataset exported as PDF/JSON');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Placement Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive statistical breakdowns across departments, salary slabs, and recruitment categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3 py-1.5 text-xs font-semibold"
          >
            <option value="2025">Graduating Batch 2025</option>
            <option value="2024">Graduating Batch 2024</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Stats
          </Button>
        </div>
      </div>

      {/* Top 4 Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass className="p-4">
          <span className="text-xs font-bold text-slate-500 uppercase">Top Dept Placement</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            CSE (96.6%)
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">174 Placed / 180</span>
        </Card>

        <Card glass className="p-4">
          <span className="text-xs font-bold text-slate-500 uppercase">Average CTC Peak</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            18.4 LPA (CSE)
          </p>
          <span className="text-[11px] text-brand-600 font-semibold">High: 54.0 LPA</span>
        </Card>

        <Card glass className="p-4">
          <span className="text-xs font-bold text-slate-500 uppercase">Core Offers</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            71 Offers
          </p>
          <span className="text-[11px] text-violet-600 font-semibold">ECE & Mechanical</span>
        </Card>

        <Card glass className="p-4">
          <span className="text-xs font-bold text-slate-500 uppercase">PPO Conversions</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">
            84.2%
          </p>
          <span className="text-[11px] text-slate-500">From 218 Internships</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Branch-wise Placement & Offers */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              Branch-wise Students Registered vs. Placed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_BRANCH_STATS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="branch" tickLine={false} fontSize={11} />
                  <YAxis tickLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="total" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Registered" />
                  <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Placed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Salary Package Distribution Slabs */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              CTC Package Distribution (Number of Offers)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_SALARY_DISTRIBUTION}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="range" tickLine={false} fontSize={11} />
                  <YAxis tickLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Role Category Distribution Pie */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-violet-500" />
              Offers by Technical Discipline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ROLE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ROLE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accreditation Tier Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Tier-1 Super Dream (&gt;25 LPA)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">59 Offers (8.1%)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Tier-1 Dream (12 - 25 LPA)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">320 Offers (44.0%)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Tier-2 Core (6 - 12 LPA)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">296 Offers (40.7%)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Total Participating Recruiter Logos</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">84 Multi-Nationals</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
