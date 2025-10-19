
import React, { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 生成时间选项（从00:00到23:30，每30分钟一个间隔）
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  // 点击外部区域关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 当选择时间时，更新值并关闭下拉框
  const handleSelectTime = (time: string) => {
    setInputValue(time);
    onChange(time);
    setIsOpen(false);
  };

  // 当输入框获得焦点时，打开下拉框
  const handleFocus = () => {
    setIsOpen(true);
  };

  // 当输入框失去焦点时，验证输入的时间格式
  const handleBlur = () => {
    if (!timeOptions.includes(inputValue)) {
      // 如果输入的时间不在选项中，恢复到之前的有效值
      setInputValue(value);
    }
  };

  // 当输入框值改变时，更新状态
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${className}`}
        placeholder="選擇時間"
        readOnly
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul>
            {timeOptions.map((time) => (
              <li
                key={time}
                className={`px-4 py-2 cursor-pointer hover:bg-pink-100 ${
                  time === inputValue ? 'bg-pink-200' : ''
                }`}
                onClick={() => handleSelectTime(time)}
              >
                {time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
