import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CalendarDays, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PopAnim = ({ children, delay = 0, className = "", style = {} }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.7, ease: [0.25, 1, 0.5, 1], delay }}
  >
    {children}
  </motion.div>
);

const EVENT_TYPES = {
  'Lomba': { class: 'event-lomba', tagClass: 'tag-lomba', icon: '🏆', label: 'Lomba' },
  'Beasiswa': { class: 'event-beasiswa', tagClass: 'tag-beasiswa', icon: '🎓', label: 'Beasiswa' },
  'Bootcamp': { class: 'event-bootcamp', tagClass: 'tag-bootcamp', icon: '💻', label: 'Bootcamp' },
  'Penting': { class: 'event-penting', tagClass: 'tag-penting', icon: '⚠️', label: 'Penting' },
  'Berita': { class: 'event-berita', tagClass: 'tag-berita', icon: '📰', label: 'Berita' },
  'default': { class: 'event-kegiatan', tagClass: 'tag-kegiatan', icon: '📅', label: 'Agenda' }
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
        .select('*')
        .lte('tanggal', endStr);

      if (isMounted && data) {
        const mapped = data.filter(item => {
           const endDateStr = item.batas_pendaftaran || item.tanggal;
           return endDateStr >= startStr;
        }).map(item => {
          const [y, m, d] = item.tanggal.split('-');
          const startDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          
          const endDateStr = item.batas_pendaftaran || item.tanggal;
          const [ey, em, ed] = endDateStr.split('-');
          const endDate = new Date(parseInt(ey), parseInt(em) - 1, parseInt(ed));

          const category = EVENT_TYPES[item.kategori] ? item.kategori : 'default';
          
          // Helper to create excerpt
          const tmp = document.createElement("DIV");
          tmp.innerHTML = item.konten || '';
          const text = tmp.textContent || tmp.innerText || "";
          const desc = text.substring(0, 60) + (text.length > 60 ? "..." : "");

          return {
            id: item.id,
            startDate,
            endDate,
            type: category,
            title: item.judul,
            desc: desc,
            status: item.status || 'Buka', 
            statusClass: item.status === 'Tutup' ? 'status-past' : 'status-upcoming'
          };
        });
        
        mapped.sort((a, b) => a.startDate - b.startDate);
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
    ? events.filter(e => {
        const current = selectedDate.getTime();
        return current >= e.startDate.getTime() && current <= e.endDate.getTime();
      })
    : events;

  const getEventTitle = () => {
    if (selectedDate) {
      return `Acara pada ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
    return `Semua Acara - ${MONTH_NAMES[month]} ${year}`;
  };

  const getEventForDay = (day) => {
    const current = new Date(year, month, day).getTime();
    return events.find(e => current >= e.startDate.getTime() && current <= e.endDate.getTime());
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
                  <stop offset="1" stopColor="var(--gold-500, #c49630)" />
                </linearGradient>
              </defs>
            </svg>
            <CalendarDays size={28} stroke="var(--gold-500)" strokeWidth={2} />
            Kalender Prestasi
          </h2>
        </div>
        <div className="calendar-layout">
          {/* Kalender Matriks */}
          <div className="calendar-matrix-container">
            <div className="calendar-month-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '5px' }}>
                <ChevronLeft size={24} />
              </button>
              <span>{MONTH_NAMES[month]} {year}</span>
              <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '5px' }}>
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
                    style={isToday(day) && !isSelected ? { border: '2px solid var(--gold-500)', color: 'var(--text-primary)', fontWeight: 'bold' } : {}}
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
                  style={{ fontSize: '0.8rem', background: 'var(--primary-100)', color: 'var(--primary-900)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  Tampilkan Semua
                </button>
              )}
            </h3>
            
            <div className="calendar-grid">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt, index) => {
                  const typeInfo = EVENT_TYPES[evt.type];
                  return (
                    <PopAnim key={evt.id} className={`event-card ${typeInfo.class}`} delay={index * 0.1}>
                      <div className="event-date">
                        {evt.startDate.getTime() !== evt.endDate.getTime() ? (
                          <>
                            <span className="event-day" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{evt.startDate.getDate().toString().padStart(2, '0')}-{evt.endDate.getDate().toString().padStart(2, '0')}</span>
                            <span className="event-month">{MONTH_NAMES[evt.startDate.getMonth()].substring(0, 3)}</span>
                          </>
                        ) : (
                          <>
                            <span className="event-day">{evt.startDate.getDate().toString().padStart(2, '0')}</span>
                            <span className="event-month">{MONTH_NAMES[evt.startDate.getMonth()].substring(0, 3)}</span>
                          </>
                        )}
                      </div>
                      <div className="event-info">
                        <span className={`event-tag ${typeInfo.tagClass}`}>
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                        <h4 className="event-title">{evt.title}</h4>
                      </div>
                      <div className={`event-status ${evt.statusClass}`}>{evt.status}</div>
                    </PopAnim>
                  );
                })
              ) : (
                <div className="no-events" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1', background: 'var(--card-bg)', borderRadius: 'var(--radius-xl)' }}>
                  <CalendarDays size={48} stroke="var(--text-secondary)" strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <p>Tidak ada jadwal acara pada tanggal ini.</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Link to="/info-akademik" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}>
                View Detail <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
