import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const initialState = {
  view: "year",
  showSearch: false,
  searchInput: "",
  selectedMonth: null,
  selectedDay: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "GO_YEAR":
      return {
        ...state,
        view: "year",
        showSearch: false,
        searchInput: "",
        selectedMonth: null,
        selectedDay: null,
      };

    case "GO_WEEK":
      return {
        ...state,
        view: "week",
        showSearch: false,
        searchInput: "",
        selectedMonth: action.payload ?? state.selectedMonth,
        selectedDay: null,
      };

    case "GO_DAY":
      return {
        ...state,
        view: "day",
        showSearch: false,
        searchInput: "",
        selectedDay: action.payload,
      };

    case "TOGGLE_SEARCH":
      return {
        ...state,
        showSearch: !state.showSearch,
        searchInput: "",
      };

    case "SET_INPUT":
      return {
        ...state,
        searchInput: action.payload,
      };

    default:
      return state;
  }
}

const MonthlyView = () => {
  //-------------useReducer FOR HANDLE THE COMPLEX STATES

  const [state, dispatch] = useReducer(reducer, initialState);

  const { view, showSearch, searchInput, selectedMonth, selectedDay } = state;

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  //-----CURRENT-DATE
  const todayKey = new Date().toISOString().split("T")[0];

  // -- Monthly_Data---------

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

  // ------- MONTHLY VIEW-------------//

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

      let dayObj = monthObj.days.find((d) => d.date === e.date);
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

  //-------HANDLE YEAR-MONTH, WEEK, DAYS---------

  const filteredData = useMemo(() => {
    const input = searchInput.toLowerCase().trim();

    // --------YEAR VIEW
    if (view === "year") {
      if (!input) return structuredData;

      return structuredData.filter((m) =>
        `${m.month} ${m.year}`.toLowerCase().includes(input)
      );
    }

    // ------------ WEEK VIEW
    if (view === "week") {
      if (!selectedMonth) return [];
      if (!input) return selectedMonth.days;

      return selectedMonth.days.filter((d) =>
        `${d.day} ${d.date}`.toLowerCase().includes(input)
      );
    }

    // --------------DAY VIEW
    if (view === "day") {
      if (!selectedDay) return [];
      if (!input) return selectedDay.items;

      return selectedDay.items.filter((i) =>
        `${i.amount} ${i.description} ${i.time}`.toLowerCase().includes(input)
      );
    }

    return [];
  }, [view, searchInput, structuredData, selectedMonth, selectedDay]);

  

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
      {view === "year" && (
        <div className="  2xl:w-4/5 w-[94%] mx-auto mt-5 flex flex-col gap-5 h-full pb-6">
          <div className="relative border-2 border-[var(--border-main)] rounded-lg bg-[var(--primary-bg)] p-3 sm:p-6 h-[75vh] overflow-y-auto">
            <div className="flex justify-between h-10 md:h-14 ">
              <div>
                <span className="font-bold text-lg">
                  {!showSearch && "Expenses History"}
                </span>
              </div>

              <div className="flex absolute right-3 sm:right-6">
                {showSearch && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) =>
                      dispatch({ type: "SET_INPUT", payload: e.target.value })
                    }
                    className="bg-[var(--input-bg)] px-5 py-1 rounded-sm font-medium text-[0.9rem] border-2 border-[var(--border-main)] focus:border-[var(--click-btn)] focus:ring-3 focus:ring-[#3B82F6]/20 outline-none transition ease-in-out duration-300; "
                  />
                )}

                <span
                  onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}
                  className=" ml-2 cursor-pointer border-2 border-[var(--click-btn)] p-2 rounded-lg hover:bg-[var(--click-btn)] transition-all duration-300"
                >
                  {showSearch ? <MdCancel /> : <IoSearch />}
                </span>
              </div>
            </div>

            {filteredData.length === 0 && (
              <p className="text-center text-[#c4c9d1] mt-10">
                No matching records
              </p>
            )}

            {filteredData.map((m) => (
              <div key={m.monthKey} className="mt-7">
                <div
                  onClick={() => dispatch({ type: "GO_WEEK", payload: m })}
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

      {view === "week" && selectedMonth && (
        <div className="fixed inset-0 backdrop-blur-sm">
          <div
            className="w-[90%] xl:w-[50%] max-h-[60vh] overflow-y-auto bg-[var(--primary-bg)] border-2 border-[var(--click-btn)] rounded-lg ring-2 ring-[#3B82F6]/10
              outline-none py-1 my-50 mx-auto z-40 transition-all ease-in-out duration-500 "
          >
            <div className="relative border-b border-[var(--border-main)] h-10.5 md:h-14 ">
              {!showSearch && (
                <button
                  onClick={() => dispatch({ type: "GO_YEAR" })}
                  className="border-2 font-medium ml-2 sm:ml-5 bg-[var(--primary-bg)] rounded-lg px-3 py-1 sm:mt-5 mt-1 cursor-pointer border-blue-500/20 hover:bg-[var(--click-btn)]"
                >
                  ← Back
                </button>
              )}

              <div className="flex absolute top-1 sm:top-3 right-3">
                {showSearch && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) =>
                      dispatch({ type: "SET_INPUT", payload: e.target.value })
                    }
                    className="bg-[var(--input-bg)] px-5 py-1 rounded-sm font-medium text-[0.9rem] border-2 border-[var(--border-main)] focus:border-[var(--click-btn)] focus:ring-3 focus:ring-[#3B82F6]/20 outline-none transition ease-in-out duration-300; "
                  />
                )}

                <span
                  onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}
                  className=" ml-2 cursor-pointer border-2 border-[var(--click-btn)] p-2 rounded-lg hover:bg-[var(--click-btn)] transition-all duration-300"
                >
                  {showSearch ? <MdCancel /> : <IoSearch />}
                </span>
              </div>
            </div>

            {filteredData.length === 0 && (
              <p className="text-center text-[#c4c9d1] mt-10">
                No matching records
              </p>
            )}

            {filteredData.map((d) => (
              <div key={d.date} className="sm:p-4 p-3">
                <div
                  onClick={() => dispatch({ type: "GO_DAY", payload: d })}
                  className="hover:bg-[var(--hover-drill)] border-2 border-blue-500/10 rounded-lg p-2 sm:p-3 box_Hover cursor-pointer"
                >
                  <div className="flex justify-between  flex-wrap   ">
                    <div className="md:flex-1 flex-2 p-3 relative  ">
                      <span className=" font-bold px-2 rounded text-[var(--click-btn)]">
                        {d.day}
                      </span>
                      <span className="text-bold  absolute right-0 sm:right-7 md:left-32">
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

      {view === "day" && selectedDay && (
        <div className="fixed inset-0 backdrop-blur-sm">
          <div
            className="w-[90%] xl:w-[50%] max-h-[60vh] bg-[var(--primary-bg)]  border-2 border-[var(--click-btn)] rounded-lg ring-2 ring-[#3B82F6]/10
              outline-none py-1 my-50 mx-auto z-40 transition-all ease-in-out duration-500 overflow-y-auto"
          >
            <div className="relative border-b border-[var(--border-main)] h-10.5 md:h-14 ">
              {!showSearch && (
                <button
                  onClick={() => dispatch({ type: "GO_WEEK" })}
                  className="border-2 font-medium ml-2 sm:ml-5 bg-[var(--primary-bg)]  rounded-lg px-3 py-1 sm:mt-5 mt-1 cursor-pointer border-blue-500/20 hover:bg-[var(--click-btn)]"
                >
                  ← Back
                </button>
              )}

              <div className="flex absolute top-1 sm:top-3 right-3">
                {showSearch && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) =>
                      dispatch({ type: "SET_INPUT", payload: e.target.value })
                    }
                    className="bg-[var(--input-bg)] px-5 py-1 rounded-sm font-medium text-[0.9rem] border-2 border-[var(--border-main)] focus:border-[var(--click-btn)] focus:ring-3 focus:ring-[#3B82F6]/20 outline-none transition ease-in-out duration-300; "
                  />
                )}

                <span
                  onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}
                  className=" ml-2 cursor-pointer border-2 border-[var(--click-btn)] p-2 rounded-lg hover:bg-[var(--click-btn)] transition-all duration-300"
                >
                  {showSearch ? <MdCancel /> : <IoSearch />}
                </span>
              </div>
            </div>

            {filteredData.length === 0 && (
              <p className="text-center text-[#c4c9d1] mt-10">
                No matching records
              </p>
            )}

            {filteredData.map((i) => (
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
