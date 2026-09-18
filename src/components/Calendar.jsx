import { useState, useEffect, useRef } from 'react';
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

const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function buildDateStr(evt) {
  const formatDate = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  const sameDay = evt.startDate.getTime() === evt.endDate.getTime();
  const sameMonth = evt.startDate.getMonth() === evt.endDate.getMonth() && evt.startDate.getFullYear() === evt.endDate.getFullYear();
  const sameYear = evt.startDate.getFullYear() === evt.endDate.getFullYear();

  if (sameDay) return `${formatDate(evt.startDate)} ${evt.startDate.getFullYear()}`;
  if (sameMonth) return `${evt.startDate.getDate()} – ${evt.endDate.getDate()} ${MONTH_NAMES[evt.startDate.getMonth()]} ${evt.endDate.getFullYear()}`;
  if (sameYear) return `${formatDate(evt.startDate)} – ${formatDate(evt.endDate)} ${evt.endDate.getFullYear()}`;
  return `${formatDate(evt.startDate)} ${evt.startDate.getFullYear()} – ${formatDate(evt.endDate)} ${evt.endDate.getFullYear()}`;
}

function EventCard({ evt, index }) {
  const typeInfo = EVENT_TYPES[evt.type] || EVENT_TYPES['default'];
  const dateStr = buildDateStr(evt);

  return (
    <PopAnim className={`event-card ${typeInfo.class}`} delay={index * 0.1}>
      <div className="event-info">
        <span className={`event-tag ${typeInfo.tagClass}`}>
          {typeInfo.icon} {typeInfo.label}
        </span>
        <h4 className="event-title">{evt.title}</h4>
        <span className="event-date-range">
          <CalendarDays size={14} strokeWidth={2} />
          {dateStr}
        </span>
      </div>
    </PopAnim>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const carouselRef = useRef(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
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

          return {
            id: item.id,
            startDate,
            endDate,
            type: category,
            title: item.judul,
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
      setSelectedDate(null);
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

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    // Scroll ~1 column width
    const scrollAmount = carouselRef.current.offsetWidth / 2;
    carouselRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
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
            Kalender Akademik
          </h2>
        </div>
        <div className="calendar-layout">
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

              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day empty"></div>
              ))}

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

          <div className="calendar-events-container">
            <div className="events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="events-date-title" id="events-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {getEventTitle()}
                {selectedDate && (
                  <button onClick={() => setSelectedDate(null)} className="btn-show-all">
                    Tampilkan Semua
                  </button>
                )}
              </h3>
              
              {filteredEvents.length > 4 && (
                <div className="carousel-nav" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => scrollCarousel(-1)} className="carousel-nav-btn" aria-label="Scroll kiri"><ChevronLeft size={18} /></button>
                  <button onClick={() => scrollCarousel(1)} className="carousel-nav-btn" aria-label="Scroll kanan"><ChevronRight size={18} /></button>
                </div>
              )}
            </div>

            {filteredEvents.length > 0 ? (
              <div className="calendar-grid" ref={carouselRef}>
                {filteredEvents.map((evt, index) => (
                  <EventCard key={evt.id} evt={evt} index={index} />
                ))}
              </div>
            ) : (
              <div className="no-events" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--card-bg)', borderRadius: 'var(--radius-xl)' }}>
                <CalendarDays size={48} stroke="var(--text-secondary)" strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block' }} />
                <p>Tidak ada jadwal acara pada tanggal ini.</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Link to="/info-akademik" className="btn-view-detail">
                View Detail <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
