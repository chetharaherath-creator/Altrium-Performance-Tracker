import React from 'react';
import Card from '../components/ui/Card';
import InfoAlert from '../components/ui/InfoAlert';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';

export default function EvidenceSubmissions() {
  const mockData = [
    { person: 'N. Perera', team: 'Cyber', plan: 'PIP', status: 'Submitted', lastUpdate: '18 Aug 2026' },
    { person: 'D. Fernando', team: 'Cyber', plan: 'PDP', status: 'Pending', lastUpdate: '16 Aug 2026' },
    { person: 'M. De Silva', team: 'Cyber', plan: 'PIP', status: 'Not submitted', lastUpdate: '-' },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1">CYBER TEAM ONLY</p>
          <h1 className="text-3xl font-semibold text-gray-900 leading-tight">PIP & PDP evidence</h1>
        </div>
        
        {/* Toggle - Mockup */}
        <div className="flex bg-white rounded-md p-1 border border-gray-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-medium rounded bg-amber-500 text-white shadow">Cyber Team Manager</button>
          <button className="px-4 py-2 text-sm font-medium rounded text-gray-500 hover:bg-gray-50">Department Manager</button>
        </div>
      </div>

      <InfoAlert title="Strict team access" variant="green">
        Only Cyber employees are shown. Software team records are not available to this manager.
      </InfoAlert>

      <Card 
        title="Evidence submission status" 
        subtitle="Submitted means the employee or manager completed their final submission."
        rightElement={
          <span className="bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md text-sm font-medium border border-gray-200">
            Active Cycle: Q2 • FY 2026
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Person</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Team / Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Update</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.person}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{row.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.lastUpdate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button variant="outline" className="text-xs px-3 py-1 bg-white">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
