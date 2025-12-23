import React, { useContext } from "react";
import { DateContext } from "./DailyView";

const CurrentDay = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const { selectedDay, setSelectedDay } = useContext(DateContext);

  const todayIndex = new Date().getDay();
  const selectedIndex = selectedDay.getDay();

  const handleDay = (index) => {
    const today = new Date();
    const diff = index - today.getDay();
    const newDate = new Date();
    newDate.setDate(today.getDate() + diff);
    setSelectedDay(newDate);
  };

  return (
    <div className="bg-[var(--primary-bg)] rounded-lg p-3 sm:p-4 flex justify-center gap-1 sm:gap-2">
      {days.map((day, index) => {
        const isToday = index === todayIndex;
        const isSelected = index === selectedIndex;

        return (
          <span
            key={index}
            onClick={() => handleDay(index)}
            className={`border border-[var(--circle-border)] font-medium
              w-8 h-8 sm:w-10 sm:h-10
              flex items-center justify-center
              rounded-full cursor-pointer
              transition-all duration-300
              ${
                isSelected && isToday
                  ? "bg-[#16A34A] text-black" // Selected Today (Dark Green)
                  : isToday
                  ? "bg-green-500/40 border-green-500" // Today (Light Green)
                  : isSelected
                  ? "bg-[var(--click-btn)] text-white" // Selected Day
                  : "text-[var(--main-text)] hover:text-white hover:border-[var(--click-btn)] hover:bg-[#362F31]"
              }`}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
};

export default CurrentDay;
