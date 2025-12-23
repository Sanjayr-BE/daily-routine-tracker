import React, { useEffect, useMemo, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";

const MonthlyView = () => {
  const [dropin, SetDropIn] = useState("Year");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const todayKey = new Date().toISOString().split("T")[0];

  // -- Monthly_Data
  // ------------------------------------------------
  useEffect(() => {
    const expences = getFromStorage("Expences_Data") || [];
    const monthly = getFromStorage("Monthly_Data") || [];

    const completedDays_Data = expences.filter((e) => e.date < todayKey);
    const past_Delete_Data = expences.filter((e) => e.date >= todayKey);

    completedDays_Data.forEach((e) => {
      if (!monthly.some((m) => m.id === e.id)) {
        monthly.push(e);

      }
    });

    saveToStorage("Monthly_Data", monthly);
    saveToStorage("Expences_Data", past_Delete_Data);
  }, [todayKey]);

  // ------- MONTHLY VIEW
  // ------------------------------------------------
  const monthlyViewSource = useMemo(() => {
    const monthly = getFromStorage("Monthly_Data") || [];
    const expences = getFromStorage("Expences_Data") || [];

    const todayExpences = expences.filter((e) => e.date === todayKey);

    return [...monthly, ...todayExpences];
  }, [todayKey]);

  // ------BUILD YEAR → MONTH → DAY STRUCTURE----------//

  const structuredData = useMemo(() => {
    const result = [];

    monthlyViewSource.forEach((e) => {
      const d = new Date(e.date);

      const year = d.getFullYear();
      const month = d.toLocaleString("default", { month: "long" });
      const monthKey = `${year}-${d.getMonth() + 1}`;
      const day = d.toLocaleString("default", { weekday: "long" });

      let monthObj = result.find((m) => m.monthKey === monthKey);
      if (!monthObj) {
        monthObj = {
          year,
          month,
          monthKey,
          total: 0,
          days: [],
        };
        result.push(monthObj);
      }

      monthObj.total += e.amount;

      let dayObj = monthObj.days.find((dy) => dy.date === e.date);
      if (!dayObj) {
        dayObj = {
          date: e.date,
          day,
          total: 0,
          items: [],
        };
        monthObj.days.push(dayObj);
      }

      dayObj.total += e.amount;
      dayObj.items.push(e);
    });

    return result;
  }, [monthlyViewSource]);

  // ------------------UI------------------

  if (structuredData.length === 0) {
    return (
      <div className="2xl:w-4/5 w-[94%] mx-auto mt-5 flex flex-col gap-5 h-full pb-6">
        <div className="border-2 border-[var(--border-main)] h-[70vh] bg-[var(--primary-bg)]  rounded-lg p-3 sm:p-6 flex justify-center items-center">
          <p className=" sm:text-2xl text-[1.3rem] text-[#c4c9d1]">
            No Recordes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {dropin === "Year" && (
        <div className="2xl:w-4/5 w-[94%] mx-auto mt-5 flex flex-col gap-5 h-full pb-6">
          <div className="border-2 border-[var(--border-main)] rounded-lg bg-[var(--primary-bg)] p-3 sm:p-6 h-[75vh] overflow-y-auto">
            <p className="font-bold text-lg">Expenses History</p>

            {structuredData.map((m) => (
              <div key={m.monthKey} className="sm:p-4 p-3">
                <div
                  onClick={() => {
                    SetDropIn("Week");
                    setSelectedMonth(m);
                  }}
                  className="hover:bg-[var(--hover-drill)] border-2 border-blue-500/10 rounded-lg p-2 sm:p-3 box_Hover cursor-pointer"
                >
                  <div className="flex justify-between flex-wrap  ">
                    <div className="md:flex-1 flex-2 p-3 relative ">
                      <span className="font-bold  rounded">{m.month}</span>
                      <span className="font-bold absolute right-0 sm:right-7 md:left-25 text-[var(--click-btn)]">
                        {m.year}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#374151] md:flex-1 w-full p-3 ">
                      <p className="text-[#c4c9d1] text-[0.9rem] font-medium text-center">
                        <span className="font-bold">Monthly-Total -</span>{" "}
                        <span className="font-bold text-[#16A34A]">{`₹${m.total}.00`}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {week} */}

      {dropin === "Week" && selectedMonth && (
        <div className="fixed inset-0 backdrop-blur-sm">
          <div
            className="w-[90%] xl:w-[50%] max-h-[60vh] overflow-y-auto bg-[var(--primary-bg)] border-2 border-[var(--click-btn)] rounded-lg ring-2 ring-[#3B82F6]/10
              outline-none py-1 my-50 mx-auto z-40 transition-all ease-in-out duration-500 "
          >
            <div className="border-b border-[var(--border-main)] ">
              <button
                onClick={() => SetDropIn("Year")}
                className="border-2 font-medium ml-2 sm:ml-5 bg-[var(--primary-bg)] rounded-lg px-3 py-1 sm:mt-5 mt-1 cursor-pointer border-blue-500/20 hover:bg-[var(--click-btn)]"
              >
                ← Back
              </button>
            </div>

            {selectedMonth.days.map((d) => (
              <div key={d.date} className="sm:p-4 p-3">
                <div
                  onClick={() => {
                    SetDropIn("Day"), setSelectedDay(d);
                  }}
                  className="hover:bg-[var(--hover-drill)] border-2 border-blue-500/10 rounded-lg p-2 sm:p-3 box_Hover cursor-pointer"
                >
                  <div className="flex justify-between  flex-wrap  ">
                    <div className="md:flex-1 flex-2 p-3 relative ">
                      <span className="font-bold px-2 rounded text-[var(--click-btn)]">
                        {d.day}
                      </span>
                      <span className="text-bold absolute right-0 sm:right-7 md:left-25">
                        {d.date}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#374151] md:flex-1 w-full p-3 ">
                      <p className="text-[#c4c9d1] text-[0.9rem] font-medium text-center">
                        <span className="font-bold">Weekly-Total -</span>{" "}
                        <span className="text-[#16A34A]">{`₹${d.total}.00`}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {----Days--------} */}

      {dropin === "Day" && selectedDay && (
        <div className="fixed inset-0 backdrop-blur-sm">
          <div
            className="w-[90%] xl:w-[50%] max-h-[60vh] bg-[var(--primary-bg)]  border-2 border-[var(--click-btn)] rounded-lg ring-2 ring-[#3B82F6]/10
              outline-none py-1 my-50 mx-auto z-40 transition-all ease-in-out duration-500 overflow-y-auto"
          >
            <div className="border-b border-[var(--border-main)] ">
              <button
                onClick={() => SetDropIn("Week")}
                className="border-2 font-medium ml-2 sm:ml-5 bg-[var(--primary-bg)]  rounded-lg px-3 py-1 sm:mt-5 mt-1 cursor-pointer border-blue-500/20 hover:bg-[var(--click-btn)]"
              >
                ← Back
              </button>
            </div>

            {selectedDay.items.map((i) => (
              <div key={i.id} className="sm:p-4 p-3">
                <div className="hover:bg-[var(--hover-drill)] border-2 border-blue-500/10 rounded-lg p-2 sm:p-3 box_Hover">
                  <div className="flex justify-between  flex-wrap  ">
                    <div className="md:flex-1 flex-2 p-3 relative ">
                      <span className="font-bold px-2 rounded text-[#16A34A]">
                        {`₹ ${i.amount}`}
                      </span>
                      <span className="text-bold absolute right-0 sm:right-7 md:left-25">
                        {i.time}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#374151] md:flex-2 w-full p-3 ">
                      <p className="text-[#c4c9d1] text-[0.9rem] font-medium text-center">
                        {i.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyView;