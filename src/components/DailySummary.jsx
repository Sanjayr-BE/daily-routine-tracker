import React, { useContext } from "react";
import { DateContext } from "./DailyView";

const DailySummary = () => {
  const { CurrentDate, currentMonth, CurrentYear, dayStatus, CurrentDay } =
    useContext(DateContext);

  return (
    <div>
      <div className="border bg-[#1F2937]  border-[#394b65] rounded-lg p-3 sm:p-6  ">
        <p className="font-bold text-[1.2rem]">Daily Summary</p>
        <p className="font-medium text-[1.1rem] mt-5">{CurrentDay}</p>
        <p className="font-medium text-[0.9rem] mt-2 text-[#9CA3AF]">
          <span>{`${currentMonth} ${CurrentDate}, ${CurrentYear}`}</span>
        </p>
        <button
          className={`mt-2 font-bold text-[0.7rem]
        ${
          dayStatus === "Today"
            ? "bg-[#10B981]"
            : dayStatus === "Past"
            ? "bg-red-500"
            : "bg-yellow-400"
        }
         rounded-2xl h-6 w-auto px-2 `}
        >
          {dayStatus === "Today"
            ? "Today"
            : dayStatus === "Past"
            ? "Past Day"
            : "Future Day"}
        </button>
      </div>
    </div>
  );
};

export default DailySummary;
