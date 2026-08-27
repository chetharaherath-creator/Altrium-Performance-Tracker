import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import api from '../api';

export default function Home() {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'employee';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const tasksRes = await api.get('/tasks/my-tasks');
        const formattedTasks = tasksRes.data.map(task => ({
          id: `task-${task.id}`,
          date: task.createdAt,
          type: 'task',
          data: task
        }));

        let formattedReviews = [];
        if (role === 'team_manager' || role === 'department_manager') {
          try {
            const reviewsRes = await api.get('/reviews/subordinates');
            formattedReviews = reviewsRes.data.map(review => ({
              id: `review-${review.id}`,
              date: review.submitted_at,
              type: 'review_submitted',
              data: review
            }));
          } catch (e) {
            console.error('Failed to fetch subordinate reviews', e);
          }
        }

        const combined = [...formattedTasks, ...formattedReviews].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        
        setNotifications(combined);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [role]);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">Welcome back, {currentUser?.name}</h1>
        <p className="text-gray-600 mt-2">Here are your latest notifications.</p>
      </div>

      <Card title="Notifications">
        <ul className="divide-y divide-gray-100">
          {loading ? (
            <li className="py-3 text-sm text-gray-500">Loading notifications...</li>
          ) : notifications.length > 0 ? (
            notifications.map(notif => {
              if (notif.type === 'task') {
                const task = notif.data;
                return (
                  <li key={notif.id} className="py-4 flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">
                          New Task Assigned: {task.type === 'self_review' ? 'Self Review' : 'Peer Review'}
                        </span>
                        <span className="text-sm text-gray-600 mt-1 block">
                          You have been assigned to write a {task.type === 'self_review' ? 'self review' : `peer review for ${task.reviewee?.name || 'a peer'}`} for {task.quarter} {task.year}.
                        </span>
                        {task.message && (
                          <span className="text-xs text-gray-500 italic mt-2 block border-l-2 border-gray-200 pl-2">
                            Message: "{task.message}"
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notif.date).toLocaleDateString()}
                    </span>
                  </li>
                );
              } else if (notif.type === 'review_submitted') {
                const review = notif.data;
                const reviewType = review.Task?.type === 'self_review' ? 'Self Review' : 'Peer Review';
                return (
                  <li key={notif.id} className="py-4 flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">
                          Review Submitted: {reviewType}
                        </span>
                        <span className="text-sm text-gray-600 mt-1 block">
                          <span className="font-medium text-gray-800">{review.reviewer?.name}</span> has submitted a {reviewType.toLowerCase()} for <span className="font-medium text-gray-800">{review.reviewee?.name}</span>.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notif.date).toLocaleDateString()}
                    </span>
                  </li>
                );
              }
              return null;
            })
          ) : (
            <li className="py-3 flex justify-between">
              <span className="text-sm text-gray-700">You have no new notifications!</span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
