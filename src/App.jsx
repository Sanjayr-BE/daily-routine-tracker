import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";
import Meal from "./components/Meal";
import Expences from "./components/Expences";
import Routine from "./components/Routine";


const App = () => {
return (
<BrowserRouter>
<Header />
<Routes>
<Route path="/" element={<DailyView />} />
<Route path="/daily_view" element={<DailyView />} />
<Route path="/monthly_view" element={<MonthlyView />} />
<Route path="/meals_tab" element={<Meal />} />
<Route path="/expences_tab" element={<Expences />} />
<Route path="/routines_tab" element={<Routine />} />
</Routes>
</BrowserRouter>
);
};


export default App;