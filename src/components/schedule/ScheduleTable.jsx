import { useState, useEffect } from "react";
import { days, timeSlots, classColors } from "./scheduleData";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import ScheduleForm from "./ScheduleForm";
import "./ScheduleTable.css";

const ScheduleTable = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const { currentUser } = useAuth();

  const fetchSchedule = async () => {
    if (!currentUser) return;
    const q = query(collection(db, "schedule"), where("uid", "==", currentUser.uid));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSchedule(data);
  };

  useEffect(() => {
    fetchSchedule();
  }, [currentUser]);

  const handleAdd = (day, time) => {
    setSelectedSlot({ day, time });
  };

  const getClass = (day, time) => {
    return schedule.find(item => item.day === day && item.time === time);
  };

  const formatType = (type) => {
    switch (type) {
      case "lecture": return "лекція";
      case "practice": return "практична";
      case "lab": return "лабораторна";
      default: return type;
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "schedule", id));
    fetchSchedule();
  };

  const handleCopyWeek = async () => {
    if (!currentUser) return;

    try {
      const now = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);

      const q = query(
        collection(db, "schedule"),
        where("uid", "==", currentUser.uid)
      );

      const snap = await getDocs(q);
      const previousPairs = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.created && p.created.toDate() >= lastWeek);

      const copyPromises = previousPairs.map((pair) =>
        addDoc(collection(db, "schedule"), {
          ...pair,
          created: Timestamp.now(),
        })
      );

      await Promise.all(copyPromises);
      fetchSchedule();
      alert("Розклад скопійовано!");
    } catch (err) {
      console.error("Помилка копіювання розкладу:", err);
      alert("Сталася помилка при копіюванні.");
    }
  };

  return (
    <div class="schedule-scroll-container">
    <div className="schedule-table-box">
      <h2>Мій розклад</h2>


      <div className="schedule-table">
        <div className="header-row">
          <div></div>
          {days.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {timeSlots.map((time) => (
          <div className="row" key={time}>
            <div className="time-cell">{time}</div>
            {days.map((day) => {
              const pair = getClass(day, time);
              return (
                <div
                  className={`cell ${pair ? "filled" : ""}`}
                  key={day + time}
                  style={pair ? { backgroundColor: classColors[pair.type] } : {}}
                >
                  {pair ? (
                    <div className="pair-content">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(pair.id)}
                      >
                        ×
                      </button>
                      <div className="pair-subject">{pair.subject}</div>
                      <div className="pair-type">{formatType(pair.type)}</div>
                    </div>
                  ) : (
                    <div className="hex-btn" onClick={() => handleAdd(day, time)}>⬡</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>

      {selectedSlot && (
        <ScheduleForm
          slot={selectedSlot}
          onClose={() => {
            setSelectedSlot(null);
            fetchSchedule();
          }}
        />
      )}
    </div>
  );
};

export default ScheduleTable;
