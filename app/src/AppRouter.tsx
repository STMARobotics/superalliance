import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/client/Home";
import Header from "./components/header";
import SignInPage from "./pages/handlers/login/page";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import StandForm from "./pages/forms/Stand";
import NotFound from "./pages/NotFound";
import DataStandForm from "./pages/data/form/stand/ViewForm";
import DataForms from "./pages/data/forms/ViewForms";
import DataTeams from "./pages/data/teams/ViewTeams";
import PitForm from "./pages/forms/Pit";
import TeamSelection from "./pages/analysis/selection/TeamSelection";
import AdministrationSettings from "./pages/admin/Settings";
import CommentsForm from "./pages/forms/Comments";
import DataSorting from "./pages/data/sorting/ViewSorting";
import DataTeamProjections from "./pages/data/projections/ViewTeamProjections";
import DataMiddlePath from "./pages/data/middle/ViewMiddlePath";
import { useSuperAlliance } from "./contexts/SuperAllianceProvider";
import { LoadingOverlay } from "@mantine/core";

function AppRouter() {
  const { user } = useUser();
  const { loading } = useSuperAlliance();
  return (
    <Router>
      {/* HEADER */}
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
          path="/new/comments"
          element={
            <>
              <SignedIn>
                <CommentsForm />
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
                {loading ? (
                  <div>
                    <LoadingOverlay
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2, bg: "#000000" }}
                      loaderProps={{ color: "red", type: "bars" }}
                    />
                  </div>
                ) : (
                  <>
                    <DataForms />
                  </>
                )}
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
                {loading ? (
                  <div>
                    <LoadingOverlay
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2, bg: "#000000" }}
                      loaderProps={{ color: "red", type: "bars" }}
                    />
                  </div>
                ) : (
                  <>
                    <DataTeams />
                  </>
                )}
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data/sorting"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                {loading ? (
                  <div>
                    <LoadingOverlay
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2, bg: "#000000" }}
                      loaderProps={{ color: "red", type: "bars" }}
                    />
                  </div>
                ) : (
                  <>
                    <DataSorting />
                  </>
                )}
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data/team/projections"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                {loading ? (
                  <div>
                    <LoadingOverlay
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2, bg: "#000000" }}
                      loaderProps={{ color: "red", type: "bars" }}
                    />
                  </div>
                ) : (
                  <>
                    <DataTeamProjections />
                  </>
                )}
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/data/team/middlepath"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <DataMiddlePath />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        {/* ANALYSIS ROUTES */}
        <Route
          path="/analysis"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                <Navigate to="/analysis/selection" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/analysis/selection"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full relative">
              <SignedIn>
                {loading ? (
                  <div>
                    <LoadingOverlay
                      visible={true}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2, bg: "#000000" }}
                      loaderProps={{ color: "red", type: "bars" }}
                    />
                  </div>
                ) : (
                  <>
                    <TeamSelection />
                  </>
                )}
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        {/* ADMINISTRATION ROUTES */}
        <Route
          path="/admin"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                {user?.publicMetadata.role == "admin" ? (
                  <Navigate to="/admin/settings" />
                ) : (
                  <Navigate to="/" />
                )}
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" />
              </SignedOut>
            </div>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <SignedIn>
                  <AdministrationSettings />
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
