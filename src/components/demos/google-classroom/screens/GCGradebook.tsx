import React from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { demoAssignments } from '../gcDemoData';

export function GCGradebook() {
  const assignments = demoAssignments.filter(a => a.max_points > 0);

  const overallAvg = Math.round(
    assignments.filter(a => a.graded_count > 0).reduce((sum, a) => sum + (a.avg_grade / a.max_points * 100), 0) /
    assignments.filter(a => a.graded_count > 0).length
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gradebook</h1>
          <p className="text-sm text-gray-500 mt-1">Overall class average: <span className="font-semibold text-[#0d904f]">{overallAvg}%</span></p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assignment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Points</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Submitted</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Graded</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Grade</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trend</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => {
              const pct = a.graded_count > 0 ? Math.round((a.avg_grade / a.max_points) * 100) : null;
              const TrendIcon = pct === null ? Minus : pct >= 80 ? TrendingUp : TrendingDown;
              const trendColor = pct === null ? '#999' : pct >= 80 ? '#0d904f' : pct >= 60 ? '#e37400' : '#d93025';
              return (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.classroom_name}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{a.assignment_type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{a.max_points}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{a.submissions_count}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{a.graded_count}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold" style={{ color: trendColor }}>
                    {pct !== null ? `${a.avg_grade}/${a.max_points} (${pct}%)` : 'Not graded'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TrendIcon className="w-4 h-4 mx-auto" style={{ color: trendColor }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}