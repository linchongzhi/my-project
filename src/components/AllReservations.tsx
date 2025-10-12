
import React, { useState } from 'react';
import { useReservation } from '../context/ReservationContext';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import Notification from './Notification';
import ConfirmDialog from './ConfirmDialog';

const AllReservations: React.FC = () => {
  const { state, deleteReservation } = useReservation();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  
  // 按时间先后排序（从早到晚）
  const sortedReservations = [...state.reservations].sort((a, b) => {
    const dateA = new Date(a.reservationDate + ' ' + a.reservationTime);
    const dateB = new Date(b.reservationDate + ' ' + b.reservationTime);
    return dateA.getTime() - dateB.getTime();
  });

  const handleDelete = (id: string) => {
    setReservationToDelete(id);
  };

  const confirmDelete = (id: string) => {
    deleteReservation(id);
    setNotification({ message: '預約已成功刪除！', type: 'success' });
    setReservationToDelete(null);
    
    // 3秒后清除成功通知
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const cancelDelete = () => {
    setReservationToDelete(null);
    setNotification(null);
  };

  // 按日期分组预约
  const groupedReservations = sortedReservations.reduce((groups, reservation) => {
    const date = reservation.reservationDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reservation);
    return groups;
  }, {} as Record<string, typeof sortedReservations>);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">所有預約</h2>
      
      {sortedReservations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">暫無預約記錄</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReservations).map(([date, reservations]) => (
            <div key={date} className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-pink-100 px-4 py-2 font-semibold text-left">
                {format(parseISO(date), 'yyyy年MM月dd日 EEEE', { locale: zhTW })}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-pink-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">客戶姓名</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">客人編號</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">登記人</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">預約時間</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">備註</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-pink-50">
                        <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.customerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.registrar}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{reservation.reservationTime}</td>
                        <td className="px-6 py-4 text-center">{reservation.notes || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(reservation.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      {reservationToDelete && (
        <ConfirmDialog
          message="確定要刪除這個預約嗎？"
          onConfirm={() => {
            const reservation = state.reservations.find(r => r.id === reservationToDelete);
            if (reservation) {
              deleteReservation(reservationToDelete);
              setReservationToDelete(null);
              setNotification({ message: '預約已成功刪除！', type: 'success' });
              
              // 3秒后清除成功通知
              setTimeout(() => {
                setNotification(null);
              }, 3000);
            }
          }}
          onCancel={() => setReservationToDelete(null)}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default AllReservations;
