
import React, { useState, useEffect } from 'react';
import { useReservation } from '../context/ReservationContext';
import { Customer, Reservation } from '../types';
import TimePicker from './TimePicker';
import Notification from './Notification';

const ReservationForm: React.FC = () => {
  const { state, addReservation, addCustomer } = useReservation();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    customerId: '',
    registrar: '',
    reservationDate: '',
    reservationTime: '',
    notes: ''
  });
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // 添加一个ref来引用下拉列表，以便检测点击外部区域
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // 当输入姓名时，显示匹配的客户建议
  useEffect(() => {
    if (formData.customerName.length > 0) {
      const filtered = state.customers.filter(customer =>
        customer.name.toLowerCase().includes(formData.customerName.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.customerName, state.customers]);
  
  // 点击外部区域关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除相关错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 选择建议的客户
  const handleSelectCustomer = (customer: Customer) => {
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      customerId: customer.customerId
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    
    // 将焦点移回输入框，然后移除焦点，确保下拉框关闭
    const inputElement = document.querySelector('input[name="customerName"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      inputElement.blur();
    }
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = '請輸入客戶姓名';
    }
    
    if (!formData.registrar.trim()) {
      newErrors.registrar = '請輸入登記人';
    }
    
    if (!formData.reservationDate) {
      newErrors.reservationDate = '請選擇預約日期';
    }
    
    if (!formData.reservationTime) {
      newErrors.reservationTime = '請選擇預約時間';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const newReservation: Reservation = {
      id: Date.now().toString(),
      customerName: formData.customerName,
      customerId: formData.customerId,
      customerPhone: formData.phone,
      registrar: formData.registrar,
      reservationDate: formData.reservationDate,
      reservationTime: formData.reservationTime,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };
    
    addReservation(newReservation);
    
    // 如果客户不存在，添加到客户列表
    const existingCustomer = state.customers.find(c => c.name === formData.customerName);
    if (!existingCustomer) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.customerName,
        customerId: formData.customerId,
        phone: formData.phone
      };
      addCustomer(newCustomer);
    }
    
    // 重置表单
    setFormData({
      customerName: '',
      phone: '',
      customerId: '',
      registrar: '',
      reservationDate: '',
      reservationTime: '',
      notes: ''
    });
    
    setNotification({ message: '預約提交成功！', type: 'success' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">預約表單</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <div ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                onFocus={() => formData.customerName && setShowSuggestions(true)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="請輸入客戶姓名"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                  {suggestions.map(customer => (
                    <li
                      key={customer.id}
                      className="px-4 py-2 hover:bg-pink-100 cursor-pointer"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      {customer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              客人編號
            </label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="選擇姓名自動填寫"
              readOnly // 客人编号在选择姓名后自动填入，不应手动编辑
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              手機號碼
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="请输入手机号码"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              登記人 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="registrar"
              value={formData.registrar}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${
                errors.registrar ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="請輸入登記人"
            />
            {errors.registrar && (
              <p className="mt-1 text-sm text-red-600">{errors.registrar}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              預約日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="reservationDate"
              value={formData.reservationDate}
              onChange={handleChange}
              onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${
                errors.reservationDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.reservationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.reservationDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              預約時間 <span className="text-red-500">*</span>
            </label>
            <TimePicker
              value={formData.reservationTime}
              onChange={(value) => setFormData(prev => ({ ...prev, reservationTime: value }))}
              className={`${errors.reservationTime ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.reservationTime && (
              <p className="mt-1 text-sm text-red-600">{errors.reservationTime}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            備註
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="請輸入備註資訊"
          ></textarea>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            提交預約
          </button>
        </div>
      </form>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ReservationForm;
