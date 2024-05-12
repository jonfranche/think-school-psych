import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import BehavioralInterventions from "./pages/BehavioralInterventions/BehavioralInterventions";
import FAQs from "./pages/FAQs/FAQs";
import GeneralResources from "./pages/GeneralResources/GeneralResources";
import Home from "./pages/Home/Home";
import JobsAndInternships from "./pages/JobsAndInternships/JobsAndInternships";
import MentalHealth from "./pages/MentalHealth/MentalHealth";
import YourStories from "./pages/YourStories/YourStories";
import About from "./pages/About/About";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import FullBlog from "./pages/YourStories/FullBlog";
import NewBlog from "./pages/YourStories/NewBlog";
import EditBlog from "./pages/YourStories/EditBlog";
import Auth from "./pages/Auth/Auth";
import Signup from "./pages/Auth/Signup";
import NotFound from "./pages/NotFound/NotFound";
import Error from "./pages/Error/Error"
import { RequireAuth } from "./util/RequireAuth";
import { AuthProvider } from "./shared/context/auth-context";

import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/resources" element={<GeneralResources />} />
            <Route
              path="/jobsandinternships"
              element={<JobsAndInternships />}
            />
            <Route path="/mentalhealth" element={<MentalHealth />} />
            <Route
              path="/behavioralinterventions"
              element={<BehavioralInterventions />}
            />
            <Route path="/stories" element={<YourStories />} />
            <Route
              path="/stories/new"
              exact
              element={
                <RequireAuth>
                  <NewBlog />
                </RequireAuth>
              }
            />
            <Route
              path="/stories/edit/:id"
              exact
              element={
                <RequireAuth>
                  <EditBlog />
                </RequireAuth>
              }
            />
            <Route path="/stories/id/:id" exact element={<FullBlog />} />
            <Route path="/about" element={<About />} />
            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/" exact element={<Home />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
