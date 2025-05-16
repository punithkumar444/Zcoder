import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionsList from "./pages/QuestionsList";
import QuestionPage from "./pages/QuestionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuestionsList />} />
        <Route path="/questions/:questionId" element={<QuestionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


