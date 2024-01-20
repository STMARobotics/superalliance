import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/client/Home";
import Header from "./components/header";
import SignInPage from "./pages/handlers/login/page";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import StandForm from "./pages/forms/Stand";
import NotFound from "./pages/NotFound";
import DataStandForm from "./pages/data/form/stand/ViewForm";
import DataForms from "./pages/data/forms/ViewForms";
import DataTeams from "./pages/data/teams/ViewTeams";
import PitForm from "./pages/forms/Pit";

function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* CLIENT ROUTES */}
        <Route index element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        {/* NEW FORM ROUTES */}
        <Route
          path="/new/stand"
          element={
            <>
              <SignedIn>
                <StandForm />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/new/pit"
          element={
            <>
              <SignedIn>
                <PitForm />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </>
          }
        />
        {/* DATA ROUTES */}
        <Route
          path="/data/form/stand/:formId"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <DataStandForm />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <Navigate to="/data/forms" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data/forms"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <DataForms />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data/teams"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <DataTeams />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        {/* 404 ROUTES */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
