import React from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';

export default function CompanyArchive() {
  const mockData = [
    { year: 'FY 2025', completed: '98%', pending: '2%', status: 'Completed' },
    { year: 'FY 2024', completed: '100%', pending: '0%', status: 'Completed' },
    { year: 'FY 2023', completed: '95%', pending: '5%', status: 'Completed' },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">Company Archive</h1>
        <p className="text-gray-600 mt-2">Historical compliance data for all previous financial years.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Year</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Completed Reports</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Reports</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{row.completed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">{row.pending}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
