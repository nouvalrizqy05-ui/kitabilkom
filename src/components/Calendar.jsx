import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const EVENT_TYPES = {
  lomba: { class: 'event-lomba', tagClass: 'tag-lomba', icon: '🏆', label: 'Lomba' },
  beasiswa: { class: 'event-beasiswa', tagClass: 'tag-beasiswa', icon: '🎓', label: 'Beasiswa' },
  bootcamp: { class: 'event-bootcamp', tagClass: 'tag-bootcamp', icon: '💻', label: 'Bootcamp' }
};

// generateMockEvents removed to sync with admin database

const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      // Hitung tanggal awal dan akhir bulan yang sedang dilihat
      const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDay = new Date(year, month + 1, 0).getDate();
      const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('info_akademik')
        .select('id, judul, kategori, tanggal, konten')
        .in('kategori', ['Lomba', 'Beasiswa', 'Bootcamp'])
        .gte('tanggal', startStr)
        .lte('tanggal', endStr)
        .order('tanggal', { ascending: true });

      if (isMounted && data) {
        const mapped = data.map(item => {
          const [y, m, d] = item.tanggal.split('-');
          return {
            id: item.id,
            date: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
            type: item.kategori.toLowerCase(),
            title: item.judul,
            desc: item.konten,
            status: 'Informasi', 
            statusClass: 'status-upcoming'
          };
        });
        setEvents(mapped);
      }
    }
    loadEvents();
    return () => { isMounted = false; };
  }, [year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    const clickedDate = new Date(year, month, day);
    if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
      setSelectedDate(null); // Deselect if already selected
    } else {
      setSelectedDate(clickedDate);
    }
  };

  const filteredEvents = selectedDate 
    ? events.filter(e => e.date.getDate() === selectedDate.getDate())
    : events;

  const getEventTitle = () => {
    if (selectedDate) {
      return `Acara pada ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
    return `Semua Acara - ${MONTH_NAMES[month]} ${year}`;
  };

  const getEventForDay = (day) => {
    return events.find(e => e.date.getDate() === day);
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <section className="calendar-section" id="kalender">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="calTitleGrad" x1="3" y1="3" x2="25" y2="25">
                  <stop stopColor="#2F3C6E" />
                  <stop offset="1" stopColor="#7B68AE" />
                </linearGradient>
              </defs>
            </svg>
            <CalendarDays size={28} stroke="url(#calTitleGrad)" strokeWidth={2} />
            Kalender Prestasi
          </h2>
        </div>
        <div className="calendar-layout">
          {/* Kalender Matriks */}
          <div className="calendar-matrix-container">
            <div className="calendar-month-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--navy-900)', padding: '5px' }}>
                <ChevronLeft size={24} />
              </button>
              <span>{MONTH_NAMES[month]} {year}</span>
              <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--navy-900)', padding: '5px' }}>
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="calendar-matrix">
              {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}

              {/* Offset start */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day empty"></div>
              ))}

              {/* Tanggal 1 - End */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const evt = getEventForDay(day);
                const isSelected = selectedDate && selectedDate.getDate() === day;
                
                let classes = 'cal-day';
                if (evt) {
                  classes += ` has-event ${EVENT_TYPES[evt.type].class}`;
                }
                if (isSelected) {
                  classes += ' active';
                }

                return (
                  <div 
                    key={day} 
                    className={classes} 
                    onClick={() => handleDayClick(day)}
                    style={isToday(day) && !isSelected ? { border: '2px solid var(--primary-400)', color: 'var(--primary-700)', fontWeight: 'bold' } : {}}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail Acara (Card) */}
          <div className="calendar-events-container">
            <h3 className="events-date-title" id="events-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {getEventTitle()}
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  style={{ fontSize: '0.8rem', background: 'var(--primary-100)', color: 'var(--primary-700)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  Tampilkan Semua
                </button>
              )}
            </h3>
            
            <div className="calendar-grid">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(evt => {
                  const typeInfo = EVENT_TYPES[evt.type];
                  return (
                    <div key={evt.id} className={`event-card ${typeInfo.class}`}>
                      <div className="event-date">
                        <span className="event-day">{evt.date.getDate().toString().padStart(2, '0')}</span>
                        <span className="event-month">{MONTH_NAMES[evt.date.getMonth()].substring(0, 3)}</span>
                      </div>
                      <div className="event-info">
                        <span className={`event-tag ${typeInfo.tagClass}`}>
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                        <h4 className="event-title">{evt.title}</h4>
                        <p className="event-desc">{evt.desc}</p>
                      </div>
                      <div className={`event-status ${evt.statusClass}`}>{evt.status}</div>
                    </div>
                  );
                })
              ) : (
                <div className="no-events" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--gray-500)', gridColumn: '1 / -1', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-xl)' }}>
                  <CalendarDays size={48} stroke="var(--gray-300)" strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <p>Tidak ada jadwal acara pada tanggal ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
