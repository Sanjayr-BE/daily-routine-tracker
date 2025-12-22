import React, { useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { DateContext } from "./DailyView";

// Default State
let initialState = {
  mealType: "",
  time: "12:00",
  details: "",
  meals: [],
};

// {reducer funtion}

let mealReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_HANDLE":
      return {
        ...state,
        [action.name]: action.value,
      };

    case "ADD_MEAL":
      return {
        ...state,
        meals: [
          ...state.meals,
          {
            id: Date.now(),
            date: action.dateKey,
            mealType: state.mealType,
            time: state.time,
            details: state.details,
            status: "pending",
            checked: false,
          },
        ],
        mealType: "",
        time: "12:00",
        details: "",
      };
    case "TOGGLE_CHECK_BOX":
      return {
        ...state,
        meals: state.meals.map((meal) =>
          meal.id === action.id
            ? {
                ...meal,
                checked: !meal.checked,
              }
            : meal
        ),
      };
    case "HANDLE_DELETE":
      return {
        ...state,
        meals: state.meals.filter((meal) => meal.id !== action.id),
      };

    default:
      return state;
  }
};

const Meal = () => {

const {selectedDay}=useContext(DateContext)
   const dateKey=selectedDay.toISOString().split("T")[0]
  
  const isFirstRender = useRef(true);

 
  const [state, dispatch] = useReducer(mealReducer, initialState, (init) => ({
    ...init,
    meals: getFromStorage("Meals_Data"),
  }));

  //using useEffect to store the data to local storage

  useEffect(() => {

    if(isFirstRender.current){
      isFirstRender.current=false;
      return
    }
    
    saveToStorage("Meals_Data", state.meals);
  }, [state.meals]);

  //filtered meals on day-wise

  const filteredMeals = useMemo(() => {
    return state.meals.filter((meal) => meal.date === dateKey);
  }, [state.meals, dateKey]);

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

    if (
      state.mealType.trim() === "" ||
      state.time.trim() === "" ||
      state.details.trim() === ""
    ) {
      return alert("please Enter the value");
    }
    dispatch({
      type: "ADD_MEAL",
      dateKey,
    });
  };

  // {return }
  return (
    <div>
      <form className="border border-[#374151] rounded-lg p-4">
        <div className="sm:flex gap-5">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Meal Type</label>
            <input
              required
              value={state.mealType}
              name="mealType"
              onChange={handleInput}
              className="inputStyle"
              placeholder="Breakfast, Lunch, Dinner, etc."
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
        {/* {details} */}
        <div className="mt-5">
          <label className="block mb-2 font-medium">Details</label>
          <textarea
            required
            name="details"
            value={state.details}
            onChange={handleInput}
            className="inputStyle resize-none"
            placeholder="What did you eat ?"
          ></textarea>
        </div>
        {/* {+Add Meal} */}
        <div className="flex-1">
          <button
            onClick={handleAdd}
            className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded"
          >
            + Add Meal
          </button>
        </div>
      </form>

      {/* {added items} */}

      {filteredMeals.length === 0 ? (
        <div className="flex justify-center items-center h-[20vh] ">
          <p>No meals recorded for this day</p>
        </div>
      ) : (
        filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className={`border-2 rounded-lg ${
              meal.checked ? "border-green-500" : "border-[#2563EB]"
            } p-4 mt-5 box_Hover`}
          >
            <div className="flex justify-between">
              <div className="flex gap-2 sm:gap-6">
                <input
                  onChange={() =>
                    dispatch({ type: "TOGGLE_CHECK_BOX", id: meal.id })
                  }
                  type="checkbox"
                  checked={meal.checked}
                />
                <div>
                  <p className="font-medium ">{meal.mealType}</p>
                  <p className="font-medium text-[0.8rem] sm:text-[0.9rem] text-[#9CA3AF]">
                    {meal.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ">
                <span
                  className={`px-2 py-1 font-medium text-[0.8rem] rounded-2xl
                ${meal.checked ? "bg-green-500" : "bg-[#3B82F6]"}
                `}
                >
                  {meal.checked ? "Completed" : "Pending"}
                </span>
                <MdDelete
                  onClick={() =>
                    dispatch({ type: "HANDLE_DELETE", id: meal.id })
                  }
                  className="transform hover:-translate-y-1 ease-in-out duration-300 text-2xl cursor-pointer text-red-500"
                />
              </div>
            </div>

            <div
              className={`flex justify-center rounded-lg p-3 h-full w-full mt-5
              ${meal.checked ? "bg-green-500/10" : "bg-[#374151]"}
              `}
            >
              <span className="text-[#c4c9d1] max-w-50 h-auto text-[0.9rem] font-medium">
                {meal.details}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Meal;
