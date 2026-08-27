import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import InfoAlert from '../components/ui/InfoAlert';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';

export default function ReviewForm({ task: propTask, onClose, onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const task = propTask || location.state?.task;
  const taskId = propTask ? propTask.id : id;

  const [techSkills, setTechSkills] = useState('');
  const [commRating, setCommRating] = useState('');
  const [commNotes, setCommNotes] = useState('');
  const [growthAreas, setGrowthAreas] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!techSkills || !commRating || commRating === 'Select a rating') {
      setError('Please fill all required fields (Technical Skills and Communication Rating).');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reviews/submit', {
        taskId: taskId,
        content: {
          techSkills,
          commRating,
          commNotes,
          growthAreas
        }
      });
      alert('Review submitted successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/my-tasks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={handleClose} 
          className="text-amber-600 font-medium text-sm hover:underline flex items-center mb-4"
        >
          ← Back to Tasks
        </button>
        {task && (
          <p className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1">
            {task.quarter} • {task.year} • {task.type === 'self_review' ? 'Self Review' : 'Peer Review'} for {task.reviewee?.name}
          </p>
        )}
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">Complete Review Form</h1>
      </div>

      <InfoAlert title="Confidentiality Note" variant="yellow">
        Please provide honest and constructive feedback. Your input will only be visible to the authorized manager.
      </InfoAlert>

      <Card>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">1. Core Competencies</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills & Knowledge <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-500 mb-2">Describe the application of technical skills in daily tasks.</p>
                <textarea 
                  rows={4} 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500" 
                  placeholder="Provide specific examples..."
                  value={techSkills}
                  onChange={(e) => setTechSkills(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication & Teamwork <span className="text-red-500">*</span></label>
                <select 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500 mb-2"
                  value={commRating}
                  onChange={(e) => setCommRating(e.target.value)}
                >
                  <option>Select a rating</option>
                  <option>Exceeds Expectations</option>
                  <option>Meets Expectations</option>
                  <option>Needs Improvement</option>
                </select>
                <textarea 
                  rows={2} 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500 mt-2" 
                  placeholder="Additional comments..."
                  value={commNotes}
                  onChange={(e) => setCommNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">2. Areas for Growth</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Identify any potential areas where a PIP or PDP might be beneficial.</label>
              <textarea 
                rows={4} 
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500" 
                placeholder="Optional notes..."
                value={growthAreas}
                onChange={(e) => setGrowthAreas(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
