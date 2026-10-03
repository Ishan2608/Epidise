import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../stores/authStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Slot {
  start: string;
  end: string;
}

type DaySchedule = Record<string, { enabled: boolean; slots: Slot[] }>;

function emptySchedule(): DaySchedule {
  const schedule: DaySchedule = {};
  DAYS.forEach(day => {
    schedule[day] = { enabled: false, slots: [] };
  });
  return schedule;
}

function trimSeconds(time: string): string {
  return time.slice(0, 5);
}

export default function ScheduleSection() {
  const { user } = useAuthStore();

  const [alwaysAvailable, setAlwaysAvailable] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule>(emptySchedule());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      if (!user) return;

      const { data: doctorRow } = await supabase
        .from('doctors')
        .select('id, isavailable')
        .eq('user_id', user.id)
        .single();

      if (!doctorRow) {
        setLoading(false);
        return;
      }

      setAlwaysAvailable(doctorRow.isavailable === true);

      const { data: availabilityRows } = await supabase
        .from('weekly_availability')
        .select('id, day_of_week, time_slots (id, start_time, end_time)')
        .eq('doctor_id', doctorRow.id);

      if (availabilityRows) {
        const next = emptySchedule();
        availabilityRows.forEach((row: any) => {
          if (next[row.day_of_week]) {
            next[row.day_of_week] = {
              enabled: true,
              slots: (row.time_slots ?? []).map((s: any) => ({
                start: trimSeconds(s.start_time),
                end: trimSeconds(s.end_time)
              }))
            };
          }
        });
        setSchedule(next);
      }

      setLoading(false);
    }

    loadSchedule();
  }, [user]);

  function toggleDay(day: string) {
    setSchedule(prev => {
      const current = prev[day];
      const nowEnabled = !current.enabled;
      return {
        ...prev,
        [day]: {
          enabled: nowEnabled,
          slots: nowEnabled && current.slots.length === 0 ? [{ start: '09:00', end: '17:00' }] : current.slots
        }
      };
    });
  }

  function addSlot(day: string) {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, { start: '09:00', end: '17:00' }] }
    }));
  }

  function removeSlot(day: string, index: number) {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: prev[day].slots.filter((_, i) => i !== index) }
    }));
  }

  function updateSlot(day: string, index: number, field: 'start' | 'end', value: string) {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => i === index ? { ...slot, [field]: value } : slot)
      }
    }));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaveMessage(null);

    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!doctorRow) {
      setSaving(false);
      setError('Could not find your doctor record.');
      return;
    }

    const { error: availError } = await supabase
      .from('doctors')
      .update({ isavailable: alwaysAvailable })
      .eq('id', doctorRow.id);

    if (availError) {
      setSaving(false);
      setError(availError.message);
      return;
    }

    if (!alwaysAvailable) {
      for (const day of DAYS) {
        const daySchedule = schedule[day];

        const { data: existingRow } = await supabase
          .from('weekly_availability')
          .select('id')
          .eq('doctor_id', doctorRow.id)
          .eq('day_of_week', day)
          .maybeSingle();

        if (!daySchedule.enabled || daySchedule.slots.length === 0) {
          if (existingRow) {
            await supabase.from('time_slots').delete().eq('weekly_availability_id', existingRow.id);
            await supabase.from('weekly_availability').delete().eq('id', existingRow.id);
          }
          continue;
        }

        let weeklyAvailabilityId = existingRow?.id;

        if (!weeklyAvailabilityId) {
          const { data: inserted, error: insertError } = await supabase
            .from('weekly_availability')
            .insert({ doctor_id: doctorRow.id, day_of_week: day })
            .select('id')
            .single();

          if (insertError || !inserted) {
            setSaving(false);
            setError(insertError?.message ?? `Could not save ${day}.`);
            return;
          }

          weeklyAvailabilityId = inserted.id;
        } else {
          await supabase.from('time_slots').delete().eq('weekly_availability_id', weeklyAvailabilityId);
        }

        const slotRows = daySchedule.slots.map(slot => ({
          weekly_availability_id: weeklyAvailabilityId,
          start_time: `${slot.start}:00`,
          end_time: `${slot.end}:00`
        }));

        const { error: slotsError } = await supabase.from('time_slots').insert(slotRows);

        if (slotsError) {
          setSaving(false);
          setError(slotsError.message);
          return;
        }
      }
    }

    setSaving(false);
    setSaveMessage('Schedule saved.');
  }

  if (loading) {
    return <p className="doc-subtitle">Loading your schedule...</p>;
  }

  return (
    <div className="doc-section">
      <h3 className="doc-section-heading">Availability</h3>

      <div className="doc-segmented-toggle">
        <button
          type="button"
          className={!alwaysAvailable ? 'doc-segment-btn doc-segment-btn-active' : 'doc-segment-btn'}
          onClick={() => setAlwaysAvailable(false)}
        >
          Specific hours
        </button>
        <button
          type="button"
          className={alwaysAvailable ? 'doc-segment-btn doc-segment-btn-active' : 'doc-segment-btn'}
          onClick={() => setAlwaysAvailable(true)}
        >
          Always Available
        </button>
      </div>

      {alwaysAvailable ? (
        <div className="doc-info-banner">
          <FontAwesomeIcon icon={faCircleInfo} />
          <span>Setting yourself always available will let patients choose anytime for appointments.</span>
        </div>
      ) : (
        <div>
          <div className="doc-info-banner">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Set your availability to start attending patients.</span>
          </div>

          {DAYS.map(day => (
            <div className="doc-day-row" key={day}>
              <div className="doc-day-row-header">
                <span className="doc-day-name">{day}</span>
                <button
                  type="button"
                  className={schedule[day].enabled ? 'doc-toggle-switch on' : 'doc-toggle-switch'}
                  onClick={() => toggleDay(day)}
                />
              </div>

              {schedule[day].enabled && (
                <div>
                  {schedule[day].slots.map((slot, index) => (
                    <div className="doc-slot-row" key={index}>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateSlot(day, index, 'start', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateSlot(day, index, 'end', e.target.value)}
                      />
                      {schedule[day].slots.length > 1 && (
                        <button type="button" className="doc-slot-remove" onClick={() => removeSlot(day, index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="doc-add-slot-link" onClick={() => addSlot(day)}>
                    <FontAwesomeIcon icon={faPlus} /> Add more hours
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p>{error}</p>}
      {saveMessage && <p className="doc-subtitle">{saveMessage}</p>}

      <button className="doc-submit-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Schedule'}
      </button>
    </div>
  );
}
