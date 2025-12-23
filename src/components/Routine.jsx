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

// Default State
let initialState = {
  task: "",
  time: "12:00",
  routine: [],
};

// {reducer funtion}

let routineReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_HANDLE":
      return {
        ...state,
        [action.name]: action.value,
      };

    case "ADD_ROUTINE":
      return {
        ...state,
        routine: [
          ...state.routine,
          {
            id: Date.now(),
            date: action.dateKey,
            task: state.task,
            time: state.time,
            status: "pending",
            checked: false,
          },
        ],
        task: "",
        time: "12:00",
      };
    case "TOGGLE_CHECK_BOX":
      return {
        ...state,
        routine: state.routine.map((r) =>
          r.id === action.id
            ? {
                ...r,
                checked: !r.checked,
              }
            : r
        ),
      };
    case "HANDLE_DELETE":
      return {
        ...state,
        routine: state.routine.filter((r) => r.id !== action.id && r),
      };

    default:
      return state;
  }
};

const Routine = () => {
  // stored the dateKey on unique key for localStorage
  const { selectedDay } = useContext(DateContext);
  const dateKey = selectedDay.toISOString().split("T")[0];//-----------selected date
  const currentDay = new Date().toISOString().split("T")[0];//------------current date

  //use ref for dandle the unmount
  const isFirstRender = useRef(true);
  const [state, dispatch] = useReducer(
    routineReducer,
    initialState,
    (init) => ({
      ...init,
      routine: getFromStorage(`Routine_Data`),
    })
  );

  //using useEffect to store the data to local storage

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    saveToStorage(`Routine_Data`, state.routine);
  }, [state.routine]);

  //filtered meals on day-wise

  const filteredRoutine = useMemo(() => {
    return state.routine.filter((r) => r.date === dateKey);
  }, [state.routine, dateKey]);

  // {All handled Event}

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

    if (state.task.trim() === "" || state.time.trim() === "") {
      return alert("please Enter the value");
    }
    dispatch({
      type: "ADD_ROUTINE",
      dateKey,
    });
  };

  // {return }
  return (
    <div>
      <form className="border-2  border-[var(--border-main)] rounded-lg p-4">
        <div className="sm:flex gap-5">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Task</label>
            <input
              required
              value={state.task}
              name="task"
              onChange={handleInput}
              className="inputStyle"
              placeholder="Enter the task..."
            />
          </div>

          {/* {time} */}
          <div className="flex-1">
            <label className="block mb-2 font-medium">Time</label>
            <input
              required
              name="time"
              type="time"
              value={state.time}
              onChange={handleInput}
              className="inputStyle"
            />
          </div>
        </div>

        {/* {+Add Routine} */}
        <div className="flex-1 font-medium">
         <button
        disabled={currentDay > dateKey}
          onClick={handleAdd}
           className={`w-full py-2 mt-1 rounded
    ${currentDay > dateKey
      ? 
      "bg-[var(--cursor-non)] cursor-not-allowed":"bg-[var(--click-btn)] hover:bg-[var(--hover-btn)] cursor-pointer"
       }
  `}
        >
          {currentDay > dateKey ? "Access Denied" : "+ Add Routine"}
        </button>
        </div>
      </form>

      {/* {added items} */}

      {filteredRoutine.length === 0 ? (
        <div className="flex justify-center items-center h-[20vh]">
          <p>No routine for this day</p>
        </div>
      ) : (
        filteredRoutine.map((r) => (
          <div
            key={r.id}
            className={`border-2 rounded-lg ${
              r.checked ? "border-green-500" : "border-[var(--click-btn)]"
            } p-4 mt-5 box_Hover`}
          >
            <div className="flex justify-between gap-2 flex-wrap ">
              <div className="md:flex-1 flex-2 p-3 relative ">
                <input
                  onChange={() =>
                    dispatch({ type: "TOGGLE_CHECK_BOX", id: r.id })
                  }
                  type="checkbox"
                  checked={r.checked}
                />
                <span className=" absolute left-9 md:left-10">{r.time}</span>
              </div>

              <div
                className={`rounded-lg bg-[#374151] md:order-0 order-3 md:flex-2 w-full p-3  ${
                  r.checked ? "bg-green-500/10" : "bg-[#374151]"
                }`}
              >
                <p
                  className={`text-[#c4c9d1] font-medium text-center  ${
                    r.checked &&
                    "line-through decoration-1 decoration-[#4c586e]"
                  }`}
                >
                  {r.task}
                </p>
              </div>

              <div className=" p-3 flex-1 relative ">
                <span
                  className={`px-2 py-1 font-medium text-[0.8rem] rounded-2xl absolute right-10 top-3
                ${r.checked ? "bg-green-500" : "bg-[var(--click-btn)]"}
                `}
                >
                  {r.checked ? "Completed" : "Pending"}
                </span>
                <MdDelete
                  className="transform hover:-translate-y-1 ease-in-out duration-300 text-2xl absolute right-0 top-3 cursor-pointer text-red-500"
                  onClick={() => dispatch({ type: "HANDLE_DELETE", id: r.id })}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Routine;
