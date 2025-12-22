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
    <div className="border bg-[#1F2937] border-[#394b65] rounded-lg p-3 sm:p-4 flex justify-center gap-1 sm:gap-2">
      {days.map((day, index) => {
        const isToday = index === todayIndex;
        const isSelected = index === selectedIndex;

        return (
          <span
            key={index}
            onClick={() => handleDay(index)}
            className={`border border-[#394b65] font-medium
              w-8 h-8 sm:w-10 sm:h-10
              flex items-center justify-center
              rounded-full cursor-pointer
              transition-all duration-300
              ${
                isSelected && isToday
                  ? "bg-[#10B981] text-black" // Selected Today (Dark Green)
                  : isToday
                  ? "bg-green-500/40 border-green-500" // Today (Light Green)
                  : isSelected
                  ? "bg-blue-500 text-white" // Selected Day
                  : "text-white hover:border-[#3B82F6] hover:bg-[#362F31]"
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
