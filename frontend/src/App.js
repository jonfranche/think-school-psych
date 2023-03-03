import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
} from "react-router-dom";
import BehavioralInterventions from "./pages/BehavioralInterventions/BehavioralInterventions";
import FAQs from "./pages/FAQs/FAQs";
import GeneralResources from "./pages/GeneralResources/GeneralResources";
import Home from "./pages/Home/Home";
import JobsAndInternships from "./pages/JobsAndInternships/JobsAndInternships";
import Login from "./pages/Login/Login";
import MentalHealth from "./pages/MentalHealth/MentalHealth";
import YourStories from "./pages/YourStories/YourStories";
import About from "./pages/About/About";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import './App.css';
import FullBlog from "./pages/YourStories/FullBlog";

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
          <Route path="/stories/:id" exact element={<FullBlog />} />
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
