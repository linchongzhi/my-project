
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Reservation, Customer } from '../types';
import { supabase } from '../lib/supabase';

// 定义Action类型
type ReservationAction =
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'DELETE_RESERVATION'; payload: string }
  | { type: 'UPDATE_RESERVATION'; payload: Reservation }
  | { type: 'SET_RESERVATIONS'; payload: Reservation[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ERROR'; payload: string };

// 定义State类型
interface ReservationState {
  reservations: Reservation[];
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: ReservationState = {
  reservations: [],
  customers: [],
  loading: false,
  error: null,
};

// Reducer函数
const reservationReducer = (state: ReservationState, action: ReservationAction): ReservationState => {
  switch (action.type) {
    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload].sort(
          (a, b) => new Date(a.reservationDate + ' ' + a.reservationTime).getTime() - 
                   new Date(b.reservationDate + ' ' + b.reservationTime).getTime()
        ),
      };
    case 'DELETE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter(res => res.id !== action.payload),
      };
    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload.id ? action.payload : res
        ).sort(
          (a, b) => new Date(a.reservationDate + ' ' + a.reservationTime).getTime() - 
                   new Date(b.reservationDate + ' ' + b.reservationTime).getTime()
        ),
      };
    case 'SET_RESERVATIONS':
      return {
        ...state,
        reservations: action.payload.sort(
          (a, b) => new Date(a.reservationDate + ' ' + a.reservationTime).getTime() - 
                   new Date(b.reservationDate + ' ' + b.reservationTime).getTime()
        ),
      };
    case 'ADD_CUSTOMER':
      // 避免重复添加客户
      const exists = state.customers.some(c => c.id === action.payload.id);
      if (exists) {
        return state;
      }
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case 'SET_CUSTOMERS':
      return {
        ...state,
        customers: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// 创建Context
interface ReservationContextType {
  state: ReservationState;
  addReservation: (reservation: Reservation) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  updateReservation: (reservation: Reservation) => Promise<void>;
  setReservations: (reservations: Reservation[]) => void;
  addCustomer: (customer: Customer) => Promise<void>;
  setCustomers: (customers: Customer[]) => void;
  setLoading: (loading: boolean) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Provider组件
interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  // 从Supabase加载初始数据
  useEffect(() => {
    const fetchData = async () => {
      if (supabase) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          // 获取预约数据
          const { data: reservations, error: reservationsError } = await supabase
            .from('reservations')
            .select('*')
            .order('reservationDate', { ascending: true })
            .order('reservationTime', { ascending: true });

          if (reservationsError) throw reservationsError;

          // 获取客户数据
          const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*');

          if (customersError) throw customersError;

          dispatch({ type: 'SET_RESERVATIONS', payload: reservations as Reservation[] });
          dispatch({ type: 'SET_CUSTOMERS', payload: customers as Customer[] });
        } catch (error: any) {
          console.error('Error loading data from Supabase:', error);
          dispatch({ type: 'ERROR', payload: error.message || '加载数据失败' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    fetchData();
  }, []);

  // 监听Supabase实时更新
  useEffect(() => {
    if (supabase) {
      // 监听预约表的实时更新
      const reservationsChannel = supabase
        .channel('reservations-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reservations',
          },
          (payload) => {
            console.log('Reservation change received:', payload);
            // 重新加载数据以反映更改
            fetchData();
          }
        )
        .subscribe();

      // 监听客户表的实时更新
      const customersChannel = supabase
        .channel('customers-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers',
          },
          (payload) => {
            console.log('Customer change received:', payload);
            // 重新加载数据以反映更改
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(reservationsChannel);
        supabase.removeChannel(customersChannel);
      };
    }
  }, []);

  const fetchData = async () => {
    if (supabase) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // 获取预约数据
        const { data: reservations, error: reservationsError } = await supabase
          .from('reservations')
          .select('*')
          .order('reservationDate', { ascending: true })
          .order('reservationTime', { ascending: true });

        if (reservationsError) throw reservationsError;

        // 获取客户数据
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*');

        if (customersError) throw customersError;

        dispatch({ type: 'SET_RESERVATIONS', payload: reservations as Reservation[] });
        dispatch({ type: 'SET_CUSTOMERS', payload: customers as Customer[] });
      } catch (error: any) {
        console.error('Error loading data from Supabase:', error);
        dispatch({ type: 'ERROR', payload: error.message || '加载数据失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const addReservation = async (reservation: Reservation) => {
    if (supabase) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { data, error } = await supabase
          .from('reservations')
          .insert([reservation])
          .select();

        if (error) throw error;

        // 重新加载数据以反映更改
        await fetchData();
      } catch (error: any) {
        console.error('Error adding reservation:', error);
        dispatch({ type: 'ERROR', payload: error.message || '添加预约失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // 如果没有配置Supabase，则使用本地状态
      dispatch({ type: 'ADD_RESERVATION', payload: reservation });
    }
  };

  const deleteReservation = async (id: string) => {
    if (supabase) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { error } = await supabase
          .from('reservations')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // 重新加载数据以反映更改
        await fetchData();
      } catch (error: any) {
        console.error('Error deleting reservation:', error);
        dispatch({ type: 'ERROR', payload: error.message || '删除预约失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // 如果没有配置Supabase，则使用本地状态
      dispatch({ type: 'DELETE_RESERVATION', payload: id });
    }
  };

  const updateReservation = async (reservation: Reservation) => {
    if (supabase) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { error } = await supabase
          .from('reservations')
          .update(reservation)
          .eq('id', reservation.id);

        if (error) throw error;

        // 重新加载数据以反映更改
        await fetchData();
      } catch (error: any) {
        console.error('Error updating reservation:', error);
        dispatch({ type: 'ERROR', payload: error.message || '更新预约失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // 如果没有配置Supabase，则使用本地状态
      dispatch({ type: 'UPDATE_RESERVATION', payload: reservation });
    }
  };

  const setReservations = (reservations: Reservation[]) => {
    dispatch({ type: 'SET_RESERVATIONS', payload: reservations });
  };

  const addCustomer = async (customer: Customer) => {
    if (supabase) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const { data, error } = await supabase
          .from('customers')
          .insert([customer])
          .select();

        if (error) {
          // 如果客户已存在，尝试更新
          if (error.code === '23505') { // 唯一约束错误
            const { error: updateError } = await supabase
              .from('customers')
              .update(customer)
              .eq('id', customer.id);
            
            if (updateError) throw updateError;
          } else {
            throw error;
          }
        }

        // 重新加载数据以反映更改
        await fetchData();
      } catch (error: any) {
        console.error('Error adding customer:', error);
        dispatch({ type: 'ERROR', payload: error.message || '添加客户失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // 如果没有配置Supabase，则使用本地状态
      dispatch({ type: 'ADD_CUSTOMER', payload: customer });
    }
  };

  const setCustomers = (customers: Customer[]) => {
    dispatch({ type: 'SET_CUSTOMERS', payload: customers });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
    <ReservationContext.Provider value={{
      state,
      addReservation,
      deleteReservation,
      updateReservation,
      setReservations,
      addCustomer,
      setCustomers,
      setLoading
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

// 自定义Hook
export const useReservation = (): ReservationContextType => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
