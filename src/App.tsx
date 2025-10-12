
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReservationProvider } from './context/ReservationContext';
import Navigation from './components/Navigation';
import ReservationForm from './components/ReservationForm';
import ReservationCalendar from './components/ReservationCalendar';
import AllReservations from './components/AllReservations';
import ExcelUpload from './components/ExcelUpload';
import './App.css';

function App() {
  return (
    <ReservationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="py-6">
            <Routes>
              <Route path="/" element={<ReservationForm />} />
              <Route path="/calendar" element={<ReservationCalendar />} />
              <Route path="/all-reservations" element={<AllReservations />} />
              <Route path="/excel-upload" element={<ExcelUpload />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ReservationProvider>
  );
}

export default App;
