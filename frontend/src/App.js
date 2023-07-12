import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BehavioralInterventions from "./pages/BehavioralInterventions/BehavioralInterventions";
import FAQs from "./pages/FAQs/FAQs";
import GeneralResources from "./pages/GeneralResources/GeneralResources";
import Home from "./pages/Home/Home";
import JobsAndInternships from "./pages/JobsAndInternships/JobsAndInternships";
import MentalHealth from "./pages/MentalHealth/MentalHealth";
import YourStories from "./pages/YourStories/YourStories";
import About from "./pages/About/About";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import "./App.css";
import FullBlog from "./pages/YourStories/FullBlog";
import NewBlog from "./pages/YourStories/NewBlog";
import EditBlog from "./pages/YourStories/EditBlog";
import Auth from "./pages/Auth/Auth";
import Signup from "./pages/Auth/Signup";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/resources" element={<GeneralResources />} />
        <Route path="/jobsandinternships" element={<JobsAndInternships />} />
        <Route path="/mentalhealth" element={<MentalHealth />} />
        <Route
          path="/behavioralinterventions"
          element={<BehavioralInterventions />}
        />
        <Route path="/stories" element={<YourStories />} />
        <Route path="/stories/new" exact element={<NewBlog />} />
        <Route path="/stories/:id" exact element={<FullBlog />} />
        <Route path="/stories/edit/:id" exact element={<EditBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/" exact element={<Home />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/resources" element={<GeneralResources />} />
        <Route path="/jobsandinternships" element={<JobsAndInternships />} />
        <Route path="/mentalhealth" element={<MentalHealth />} />
        <Route
          path="/behavioralinterventions"
          element={<BehavioralInterventions />}
        />
        <Route path="/stories" element={<YourStories />} />
        <Route path="/stories/new" exact element={<NewBlog />} />
        <Route path="/stories/:id" exact element={<FullBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" exact element={<Home />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
