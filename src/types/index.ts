
// 客户类型定义
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  customerId: string;
}

// 预约类型定义
export interface Reservation {
  id: string;
  customerName: string;
  customerId: string;
  customerPhone?: string;
  registrar: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  notes?: string;
  createdAt: string; // ISO string
}

// 公共假期类型定义
export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}
