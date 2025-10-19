
import React, { useState } from 'react';
import { useReservation } from '../context/ReservationContext';
import { Customer } from '../types';
import { parseExcelFile } from '../utils/excel';

const ExcelUpload: React.FC = () => {
  const { addCustomer } = useReservation();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('請先選擇一個Excel文件');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      // 解析Excel文件
      const customers: Customer[] = await parseExcelFile(file);
      
      // 添加客戶到系統
      customers.forEach(customer => {
        addCustomer(customer);
      });
      
      setMessage(`成功上傳 ${customers.length} 位客戶資料！`);
      setFile(null);
    } catch (error) {
      console.error('上传失败:', error);
      setMessage(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Excel客戶資料上傳</h2>
      
      <div className="mb-6 p-4 bg-pink-50 rounded-md">
        <h3 className="font-medium text-pink-700 mb-2">注意事項：</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Excel文件應包含"姓名"和"客人編號"兩個字段</li>
          <li>支持中英文標題（如：姓名/Name、客人編號/Customer ID）</li>
          <li>支持.xlsx和.xls格式</li>
        </ul>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="mb-6 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇Excel文件
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="px-4 py-2 bg-pink-100 border border-pink-300 rounded-md text-center hover:bg-pink-200">
                {file ? file.name : '點擊選擇文件'}
              </div>
            </label>
          </div>
        </div>
        
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`px-6 py-3 rounded-md text-white font-medium ${
            isUploading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-500 hover:bg-pink-600'
          }`}
        >
          {isUploading ? '上传中...' : '上传并导入'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md text-center ${
            message.includes('成功') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelUpload;
