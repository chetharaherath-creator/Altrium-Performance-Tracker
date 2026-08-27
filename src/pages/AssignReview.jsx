import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../api';

export default function AssignReview() {
  const getAutoQuarter = () => {
    const month = new Date().getMonth(); // 0 to 11
    if (month >= 0 && month <= 3) return 'Q1';
    if (month >= 4 && month <= 7) return 'Q2';
    return 'Q3';
  };

  const [reviewType, setReviewType] = useState('self_review');
  const [quarter, setQuarter] = useState(getAutoQuarter());
  const [employees, setEmployees] = useState([]);
  
  // For self review
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  // For peer review
  const [peer1Id, setPeer1Id] = useState('');
  const [peer2Id, setPeer2Id] = useState('');
  const [reviewerId, setReviewerId] = useState('');

  // Optional message
  const [optionalMessage, setOptionalMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEligibleEmployees();
  }, [quarter, reviewType]);

  const fetchEligibleEmployees = async () => {
    try {
      const res = await api.get(`/users/eligible?quarter_batch=${quarter}&review_type=${reviewType}`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const handleSelfReviewSubmit = async () => {
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tasks/assign-self', {
        employeeIds: [selectedEmployeeId],
        message: optionalMessage,
        quarter,
        year: new Date().getFullYear()
      });
      setSuccess('Self-review assigned successfully');
      setSelectedEmployeeId('');
      setOptionalMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign self-review');
    } finally {
      setLoading(false);
    }
  };

  const handlePeerReviewSubmit = async () => {
    if (!reviewerId) {
      setError('Please select a reviewer');
      return;
    }
    if (!peer1Id || !peer2Id) {
      setError('Please select exactly 2 peers');
      return;
    }
    if (peer1Id === peer2Id) {
      setError('Peers must be different employees');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tasks/assign-peer', {
        reviewerId,
        peerIds: [peer1Id, peer2Id],
        message: optionalMessage,
        quarter,
        year: new Date().getFullYear()
      });
      setSuccess('Peer-reviews assigned successfully');
      setReviewerId('');
      setPeer1Id('');
      setPeer2Id('');
      setOptionalMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign peer-review');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (reviewType === 'self_review') {
      handleSelfReviewSubmit();
    } else {
      handlePeerReviewSubmit();
    }
  };


  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1">NEW ASSIGNMENT</p>
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">Assign a review</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 w-full">
          <Card className="w-full">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review type</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value)}
                  >
                    <option value="self_review">Self review</option>
                    <option value="peer_review">Peer review</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quarter Batch</label>
                  <div className="w-full border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-sm text-gray-600 flex items-center justify-between cursor-not-allowed">
                    <span className="font-semibold">
                      {quarter === 'Q1' ? 'Quarter 1 (Jan - Apr)' : quarter === 'Q2' ? 'Quarter 2 (May - Aug)' : 'Quarter 3 (Sep - Dec)'}
                    </span>
                  </div>
                </div>
              </div>

              {reviewType === 'self_review' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee (Eligible: {employees.length})</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id} disabled={emp.isAssigned}>
                        {emp.name} {emp.isAssigned ? '(Already assigned)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {reviewType === 'peer_review' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Reviewer</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                      value={reviewerId}
                      onChange={(e) => setReviewerId(e.target.value)}
                    >
                      <option value="">Select an employee to be the reviewer</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id} disabled={emp.isAssigned}>
                          {emp.name} {emp.isAssigned ? '(Already assigned)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Peer 1</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                        value={peer1Id}
                        onChange={(e) => setPeer1Id(e.target.value)}
                      >
                        <option value="">Select first peer</option>
                        {employees.filter(emp => emp.id.toString() !== reviewerId && emp.id.toString() !== peer2Id).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Peer 2</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
                        value={peer2Id}
                        onChange={(e) => setPeer2Id(e.target.value)}
                      >
                        <option value="">Select second peer</option>
                        {employees.filter(emp => emp.id.toString() !== reviewerId && emp.id.toString() !== peer1Id).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Message (for the appointed employee)</label>
                <textarea 
                  rows={3} 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500" 
                  placeholder="Type an optional message..."
                  value={optionalMessage}
                  onChange={(e) => setOptionalMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <Button variant="outline" type="button" className="px-6 shadow-sm border-gray-200">Cancel</Button>
                <Button variant="primary" type="submit" className="px-6 py-2.5" disabled={loading}>
                  {loading ? 'Assigning...' : 'Assign review'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
