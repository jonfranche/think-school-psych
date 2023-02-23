import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
} from "react-router-dom";
import BehavioralInterventions from "./pages/BehavioralInterventions";
import FAQs from "./pages/FAQs";
import GeneralResources from "./pages/GeneralResources";
import Home from "./pages/Home";
import JobsAndInternships from "./pages/JobsAndInternships";
import Login from "./pages/Login";
import MentalHealth from "./pages/MentalHealth";
import YourStories from "./pages/YourStories";
import About from "./pages/About";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import './App.css';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Routes>
          <Route path="/resources" element={<GeneralResources />}/>
          <Route path="/jobsandinternships" element={<JobsAndInternships />} />
          <Route path="/mentalhealth" element={<MentalHealth />} />
          <Route path="/behavioralinterventions" element={<BehavioralInterventions />} />
          <Route path="/stories" element={<YourStories />} />
          <Route path="/about" element={<About />} />
          <Route path="/FAQs" element={<FAQs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" exact element={<Home />}/>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
