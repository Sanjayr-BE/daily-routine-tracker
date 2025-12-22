import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { MdDelete } from "react-icons/md";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { DateContext } from "./DailyView";

// ---------------- INITIAL STATE ----------------
const initialState = {
  amount: "",
  description: "",
  time: "12:00",
  expences: [],
};

// ---------------- REDUCER ----------------
const expencesReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_HANDLE":
      return {
        ...state,
        [action.name]: action.value,
      };

    case "ADD_EXPENCES":
      return {
        ...state,
        expences: [
          ...state.expences,
          {
            id: Date.now(),
            date: action.dateKey,
            amount: Number(state.amount),
            time: state.time,
            description: state.description,
          },
        ],
        amount: "",
        time: "12:00",
        description: "",
      };

    case "HANDLE_DELETE":
      return {
        ...state,
        expences: state.expences.filter((e) => e.id !== action.id),
      };

    default:
      return state;
  }
};

// ---------------- COMPONENT ----------------
const Expences = () => {
  // stored the dateKey on unique key for localStorage
  const { selectedDay } = useContext(DateContext);

  //--->toISOString()---date into a standard ISO format string --["2025-12-20T00:00:00.000Z"]
  //--->.split("T") ---- split the time and date in array format ---["2025-12-20", "00:00:00.000Z"]---[0--indexposition take date]
  const dateKey = selectedDay.toISOString().split("T")[0]; // ----------selected date
  const currentDay = new Date().toISOString().split("T")[0]; //-----------current date
  const isFirstRender = useRef(true);

  const [state, dispatch] = useReducer(
    expencesReducer,
    initialState,
    (init) => ({
      ...init,
      expences: getFromStorage("Expences_Data"),
    })
  );

  //----------------HANDLE TOTAL EXPENCES DAILY------------
  const Daily_Total_Expences = useMemo(() => {
    return state.expences.reduce(
      (sum, e) => (e.date === dateKey ? sum + Number(e.amount) : sum),
      0
    );
  }, [state.expences, dateKey]);

  // ---------------- SAVE TO LOCAL STORAGE ----------------
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    saveToStorage("Expences_Data", state.expences);
  }, [state.expences]);

  //filtered expences on day-wise

  const filteredExpences = useMemo(() => {
    return state.expences.filter((e) => e.date === dateKey);
  }, [state.expences, dateKey]);

  // ---------------- HANDLERS ----------------
  let handleInput = (e) => {
    let { name, value } = e.target;
    dispatch({
      type: "INPUT_HANDLE",
      name,
      value,
    });
  };

  let handleAdd = (e) => {
    e.preventDefault();

    if (
      state.amount.trim() === "" ||
      state.time.trim() === "" ||
      state.description.trim() === ""
    ) {
      return alert("please Enter the value");
    }
    dispatch({
      type: "ADD_EXPENCES",
      dateKey,
    });
  };

  // ---------------- UI ----------------
  return (
    <div>
      <form className="border border-[#374151] rounded-lg p-4">
        <div className="sm:flex gap-5">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={state.amount}
              onChange={handleInput}
              className="inputStyle"
              placeholder="0.00"
            />
          </div>
          {/* {time} */}
          <div className="flex-1">
            <label className="block mb-2 font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={state.time}
              onChange={handleInput}
              className="inputStyle"
            />
          </div>
        </div>
        {/* {Description} */}
        <div className="mt-5">
          <label className="block mb-2 font-medium">Description</label>
          <input
            name="description"
            value={state.description}
            onChange={handleInput}
            className="inputStyle"
            placeholder="What did you spend on?"
          />
        </div>
        {/* {+ Add expense} */}
        <button
          disabled={currentDay !== dateKey}
          onClick={handleAdd}
          className={`w-full py-2 mt-1 rounded
    ${
      currentDay === dateKey
        ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
        : "bg-blue-300/70 cursor-not-allowed"
    }
  `}
        >
          {currentDay === dateKey ? "+ Add Expense" : "Access Denied"}
        </button>
      </form>

      {/* {Expences Total} */}

      <div className="border border-[#374151] rounded-lg p-2 sm:p-4 mt-5 flex justify-between">
        <span className="font-bold">Daily Total</span>

        <span className="font-bold text-xl">₹ {Daily_Total_Expences}</span>
      </div>

      {/* ---------------- LIST ---------------- */}
      {filteredExpences.length === 0 ? (
        <p className="text-center mt-10">No expenses recorded.</p>
      ) : (
        filteredExpences.map((e) => (
          <div
            key={e.id}
            className="border-2 border-blue-500 rounded-lg p-2 sm:p-3 mt-5 box_Hover"
          >
            <div className="flex justify-between gap-2 flex-wrap  ">
              <div className="md:flex-1 flex-2 p-3 relative ">
                <span className="font-bold px-2 rounded text-green-300">
                  ₹ {e.amount}
                </span>
                <span className="text-bold absolute right-0 sm:right-7 md:left-25">
                  {e.time}
                </span>
              </div>

              <div className="rounded-lg bg-[#374151] md:order-0 order-3 md:flex-2 w-full p-3 ">
                <p className="text-[#c4c9d1] text-[0.9rem] font-medium text-center">
                  {e.description}
                </p>
              </div>

              <div className=" p-3 flex-1 relative ">
                {currentDay === dateKey && (
                  <MdDelete
                    className="transform hover:-translate-y-1 ease-in-out duration-300 text-2xl absolute right-0 cursor-pointer text-red-500"
                    onClick={() =>
                      dispatch({ type: "HANDLE_DELETE", id: e.id })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Expences;
