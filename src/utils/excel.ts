
import { Customer } from '../types';
import * as XLSX from 'xlsx';

// 解析Excel文件中的客户数据
export const parseExcelFile = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      reject(new Error('请上传Excel文件(.xlsx或.xls)'));
      return;
    }

    // 使用FileReader读取文件
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('无法读取文件内容'));
          return;
        }

        // 使用xlsx库解析文件，指定更具体的类型选项
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy/mm/dd' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将工作表转换为JSON格式
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          resolve([]);
          return;
        }
        
        // 获取表头
        const headers = jsonData[0] as string[];
        
        // 查找姓名和客人编号列的索引（支持包含关键词的标题）
        const nameIndex = headers.findIndex(header => {
          if (typeof header !== 'string') return false;
          const lowerHeader = header.toLowerCase().trim();
          return lowerHeader.includes('姓名') || 
                 lowerHeader.includes('name') || 
                 lowerHeader.includes('客戶姓名') ||
                 lowerHeader.includes('客户姓名');
        });
        
        const customerIdIndex = headers.findIndex(header => {
          if (typeof header !== 'string') return false;
          const lowerHeader = header.toLowerCase().trim();
          return lowerHeader.includes('客人编号') || 
                 lowerHeader.includes('customer id') || 
                 lowerHeader.includes('id') ||
                 lowerHeader.includes('客人編號') ||
                 lowerHeader.includes('客户编号') ||
                 lowerHeader.includes('客户编号');
        });
        
        if (nameIndex === -1 || customerIdIndex === -1) {
          reject(new Error('Excel文件必须包含"姓名"和"客人编号"列'));
          return;
        }
        
        // 解析数据行
        const customers: Customer[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const name = row[nameIndex];
          const customerId = row[customerIdIndex];
          
          if (name && customerId) {
            customers.push({
              id: `${Date.now()}_${i}`,
              name: String(name).trim(),
              customerId: String(customerId).trim(),
            });
          }
        }
        
        resolve(customers);
      } catch (error: any) {
        console.error('解析Excel文件时发生错误:', error);
        reject(new Error(`解析Excel文件时发生错误: ${error.message || '未知错误'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取Excel文件时发生错误'));
    };
    
    // 读取文件为ArrayBuffer，以便解析Excel
    reader.readAsArrayBuffer(file);
  });
};

// 将客户数据转换为Excel格式并下载
export const exportCustomersToExcel = (customers: Customer[]) => {
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  
  // 准备数据（包含表头）
  const data = [
    ['姓名', '客人编号'],
    ...customers.map(customer => [customer.name, customer.customerId])
  ];
  
  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '客户资料');
  
  // 生成Excel文件并下载
  XLSX.writeFile(wb, '客户资料.xlsx');
};
