
import React, { useState } from 'react';
import { isHoliday, getHolidayName } from '../utils/holidays';
import { useReservation } from '../context/ReservationContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, parseISO, addDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const ReservationCalendar: React.FC = () => {
  const { state } = useReservation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const dateFormat = 'd';
  const rows = [];
  
  let days = [];
  let day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const clonedDay = new Date(day);
      const dayReservations = state.reservations.filter(res => 
        isSameDay(parseISO(res.reservationDate), clonedDay)
      );
      
      // 检查是否为公共假期
      const isPublicHoliday = isHoliday(clonedDay);
      // 检查是否为周末
      const isWeekend = clonedDay.getDay() === 0 || clonedDay.getDay() === 6;
      
      days.push(
        <div
          key={clonedDay.toString()}
          className={`border p-2 min-h-24 flex flex-col ${
            !isSameMonth(clonedDay, monthStart) ? 'bg-gray-100 text-gray-400' : 'bg-white'
          } ${
            isWeekend && !isPublicHoliday ? 'bg-purple-100' : '' // 周末显示淡紫色背景
          } ${
            isPublicHoliday ? 'bg-red-100' : '' // 公共假期显示浅红色背景
          }`}
        >
          <div className="text-right font-medium">
            {format(clonedDay, dateFormat)}
          </div>
          {isPublicHoliday && (
            <div className="text-xs text-center text-red-600 font-semibold mt-1">
              {getHolidayName(clonedDay)}
            </div>
          )}
          <div className="flex-1 overflow-y-auto mt-1">
            {dayReservations.map(res => (
              <div 
                key={res.id} 
                className="text-xs p-1 mb-1 bg-pink-100 rounded border border-pink-200 truncate"
                title={`${res.reservationTime} - ${res.customerName}`}
              >
                <span className="font-medium">{res.reservationTime}</span>
                <br />
                <span>{res.customerName}</span>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <button 
            onClick={prevMonth}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            上个月
          </button>
          <h2 className="text-2xl font-bold text-pink-600">
            {format(currentDate, 'yyyy年MM月', { locale: zhTW })}
          </h2>
          <button 
            onClick={nextMonth}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            下个月
          </button>
        </div>
        
        <div className="w-full">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
              <div 
                key={day} 
                className={`text-center font-semibold p-2 ${
                  index === 0 ? 'text-red-600' : // 周日红色
                  index === 6 ? 'text-red-600' : // 周六红色
                  'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {rows}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReservationCalendar;
