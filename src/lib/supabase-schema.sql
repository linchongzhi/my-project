
-- 创建客户表
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  customerId TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建预约表
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  customerName TEXT NOT NULL,
  customerId TEXT NOT NULL,
  customerPhone TEXT,
  registrar TEXT NOT NULL,
  reservationDate DATE NOT NULL,
  reservationTime TIME NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为预约表创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservationDate);
CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customerId);
