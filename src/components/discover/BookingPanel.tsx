import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import './BookingPanel.css';

export default function BookingPanel({ doctor }: { doctor: any }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate next 7 days to match weekly availability day names (e.g., "Monday", "Tuesday")
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }), // Matches text format like "Monday"
      shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      year: d.getFullYear()
    };
  });

  // Select today by default
  useEffect(() => {
    if (!selectedDate && next7Days.length > 0) {
      setSelectedDate(next7Days[0].dateStr);
    }
  }, []);

  // Fetch Reviews and Availability Slots whenever the doctor changes
  useEffect(() => {
    setSelectedSlot(null);
    setReviews([]);
    setAvailableSlots([]);

    async function fetchDoctorBackendData() {
      if (!doctor?.id) return;
      setIsLoading(true);

      try {
        // 1. Fetch real reviews from "doctor_reviews"
        const { data: reviewData, error: reviewErr } = await supabase
          .from('doctor_reviews')
          .select('*')
          .eq('doctor_id', doctor.id)
          .order('created_at', { ascending: false });

        if (reviewErr) {
          console.error('Error fetching doctor_reviews:', reviewErr.message);
        } else if (reviewData) {
          setReviews(reviewData);
        }

        // 2. Fetch weekly availability and nested time slots using Supabase join
        const { data: availabilityData, error: availErr } = await supabase
          .from('weekly_availability')
          .select(`
            id,
            day_of_week,
            time_slots (
              id,
              start_time,
              end_time
            )
          `)
          .eq('doctor_id', doctor.id);

        if (availErr) {
          console.error('Error fetching weekly_availability:', availErr.message);
        } else if (availabilityData) {
          setAvailableSlots(availabilityData);
        }
      } catch (err) {
        console.error('Unexpected error fetching details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctorBackendData();
  }, [doctor?.id]);

  // Find time slots for the currently selected date based on day of week (e.g., "Monday")
  const currentDayConfig = next7Days.find(d => d.dateStr === selectedDate);
  const matchedWeeklyRecord = availableSlots.find(
    a => a.day_of_week?.toLowerCase() === currentDayConfig?.dayName?.toLowerCase()
  );
  const slotsForSelectedDate = matchedWeeklyRecord ? matchedWeeklyRecord.time_slots : [];

  return (
    <div className="booking-panel">
      
      {/* Calendar Section */}
      <div className="calendar-section">
        <div className="calendar-header">
          <span className="month-title">{next7Days[0].month}</span>
          <span className="year-title">{next7Days[0].year}</span>
        </div>

        <div className="purple-banner">
          Select a date to see available slots
        </div>

        {/* Dynamic 7-day strip */}
        <div className="calendar-scroll-row">
          {next7Days.map(item => (
            <button 
              key={item.dateStr} 
              className={`dynamic-day-btn ${selectedDate === item.dateStr ? 'selected' : ''}`}
              onClick={() => {
                setSelectedDate(item.dateStr);
                setSelectedSlot(null);
              }}
            >
              <span className="day-name">{item.shortDay}</span>
              <span className="day-num">{item.dayNum}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slots Section */}
      <div className="slots-section">
        <div className="slots-header">
          <h4>Available Slots</h4>
          <p>Consultation slots for {currentDayConfig?.dayName}</p>
        </div>
        
        {isLoading ? (
          <p className="status-text">Checking schedule...</p>
        ) : slotsForSelectedDate.length > 0 ? (
          <div className="slots-grid">
            {slotsForSelectedDate.map((slot: any) => {
              // Format time from "09:00:00" to "9:00 AM"
              const formattedTime = new Date(`1970-01-01T${slot.start_time}`).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              });

              return (
                <button 
                  key={slot.id} 
                  className={`slot-btn ${selectedSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  {formattedTime}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="empty-slots-box">
            <p>No open slots for {currentDayConfig?.dayName}.</p>
          </div>
        )}

        <button 
          className="proceed-btn" 
          disabled={!selectedSlot}
        >
          Proceed to Pay
        </button>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h4>Patient Reviews</h4>
          <span className="rating-badge">⭐ {doctor.rating_average || '0.0'}/5</span>
        </div>

        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="reviewer-avatar">
                  PT
                </div>
                <div className="review-content">
                  <h5>Verified Patient</h5>
                  <div className="stars">⭐ {review.rating}/5</div>
                  <p>{review.review_text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="status-text">No reviews yet for this doctor.</p>
          )}
        </div>
      </div>

    </div>
  );
}
