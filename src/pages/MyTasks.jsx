import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReviewForm from './ReviewForm';

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/my-tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSelectedTask(null);
    fetchTasks(); // refresh tasks after submission
  };

  const isTaskExpired = (quarter, year) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 to 11

    if (currentYear > year) return true;
    if (currentYear < year) return false;

    if (quarter === 'Q1' && currentMonth > 3) return true;
    if (quarter === 'Q2' && currentMonth > 7) return true;
    if (quarter === 'Q3' && currentMonth > 11) return true;
    
    return false;
  };

  return (
    <div className="max-w-5xl relative">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">My Tasks</h1>
        <p className="text-gray-600 mt-2">Complete your assigned reviews below.</p>
      </div>

      <Card title="Active Assignments">
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No pending tasks.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reviewee</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quarter</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => {
                  const expired = isTaskExpired(task.quarter, task.year);
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task.type === 'self_review' ? 'Self Review' : 'Peer Review'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {task.reviewee?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.quarter} {task.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expired ? (
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                             Expired
                           </span>
                        ) : (
                           <StatusBadge status={task.status === 'pending' ? 'Pending' : 'Submitted'} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button 
                          variant="primary" 
                          className="text-xs px-4 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setSelectedTask(task)}
                          disabled={expired}
                        >
                          {expired ? 'Expired' : 'Start Form'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Overlay */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto pt-10 pb-10">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <ReviewForm 
              task={selectedTask} 
              onClose={() => setSelectedTask(null)} 
              onSuccess={handleSuccess} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
