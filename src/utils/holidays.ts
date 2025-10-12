
// 香港公共假期数据
// 由于公共假期每年都会更新，这里提供一个基础框架和部分示例数据
// 实际应用中可能需要从API获取最新的假期数据

export const getHolidaysForYear = (year: number): { date: string; name: string }[] => {
  // 这里列出一些固定的香港公共假期
  const fixedHolidays = [
    { date: `${year}-01-01`, name: '元旦' },
    { date: `${year}-07-01`, name: '香港特别行政区成立纪念日' },
    { date: `${year}-10-01`, name: '国庆节' },
    { date: `${year}-12-25`, name: '圣诞节' },
  ];

  // 动态假期（如农历新年等）需要根据年份计算
  const dynamicHolidays = getDynamicHolidays(year);

  return [...fixedHolidays, ...dynamicHolidays];
};

// 计算动态假期（如农历新年等）
const getDynamicHolidays = (year: number): { date: string; name: string }[] => {
  // 这里使用预定义的数据，实际应用中可能需要算法计算农历日期
  const dynamicHolidays: { [key: number]: { date: string; name: string }[] } = {
    2025: [
      { date: '2025-01-29', name: '农历年初一' },
      { date: '2025-01-30', name: '农历年初二' },
      { date: '2025-01-31', name: '农历年初三' },
      { date: '2025-04-05', name: '清明节' },
      { date: '2025-05-01', name: '劳动节' },
      { date: '2025-05-29', name: '佛诞' },
      { date: '2025-10-29', name: '重阳节' },
    ],
    2024: [
      { date: '2024-02-10', name: '农历年初一' },
      { date: '2024-02-11', name: '农历年初二' },
      { date: '2024-02-12', name: '农历年初三' },
      { date: '2024-04-04', name: '清明节' },
      { date: '2024-05-01', name: '劳动节' },
      { date: '2024-05-15', name: '佛诞' },
      { date: '2024-10-17', name: '重阳节' },
    ],
    2023: [
      { date: '2023-01-22', name: '农历年初一' },
      { date: '2023-01-23', name: '农历年初二' },
      { date: '2023-01-24', name: '农历年初三' },
      { date: '2023-04-05', name: '清明节' },
      { date: '2023-05-01', name: '劳动节' },
      { date: '2023-05-26', name: '佛诞' },
      { date: '2023-10-23', name: '重阳节' },
    ],
  };

  return dynamicHolidays[year] || [];
};

// 检查指定日期是否为公共假期
export const isHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const holidays = getHolidaysForYear(year);
  
  return holidays.some(holiday => holiday.date === dateString);
};

// 获取指定日期的假期名称
export const getHolidayName = (date: Date): string | null => {
  const year = date.getFullYear();
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const holidays = getHolidaysForYear(year);
  
  const holiday = holidays.find(holiday => holiday.date === dateString);
  return holiday ? holiday.name : null;
};
