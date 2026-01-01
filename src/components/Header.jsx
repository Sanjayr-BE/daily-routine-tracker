import { useContext, useState } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../theme/ThemeContext";

const Header = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();

  //! explaination why we can use
  // --> we won't use unwanted state for handle the "view"
  // -->use thsi pathname.includes("monthly") like-->["/monthly_view".includes("monthly")]

  const view = location.pathname.includes("monthly") ? "Monthly" : "Daily";

  return (
    <>
      {/* Top Header */}
      <div className="sticky top-0 bg-[var(--main-bg)] border-b border-[var(--border-main)]">
        <div>
          <div
            className="flex items-center justify-between 
                         2xl:w-4/5 mx-auto w-[94%]
                        py-3"
          >
            <div className="font-bold text-[1.3rem] ">
              Daily Routine Tracker
            </div>

            <button
              onClick={toggleTheme}
              className="cursor-pointer border-2 border-[var(--click-btn)] p-2 rounded-lg 
                       hover:bg-[var(--click-btn)] 
                       transition-all duration-300"
            >
              {theme === "dark" ? (
                <MdOutlineLightMode />
              ) : (
                <MdOutlineDarkMode />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* View Switch Buttons */}
      <div className=" 2xl:w-4/5 mx-auto w-[94%] mt-4 bg-[var(--primary-bg)] border-2 border-[var(--border-main)] rounded-lg">
        <div>
          <div
            className=" rounded-lg p-1 
                     flex gap-1"
          >
            <button
              onClick={() => navigate("/daily_view")}
              className={`cursor-pointer flex-1 font-medium
              ${
                view === "Daily"
                  ? "bg-[var(--click-btn)] text-white"
                  : " bg-transparent"
              }
               py-1 rounded-md
                       transition-all`}
            >
              Daily View
            </button>

            <button
              onClick={() => navigate("/monthly_view")}
              className={`cursor-pointer flex-1 font-medium
             ${
               view === "Monthly"
                 ? "bg-[var(--click-btn)] text-white"
                 : " bg-transparent"
             }
               py-1 rounded-md
                      transition-all`}
            >
              Monthly View
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
