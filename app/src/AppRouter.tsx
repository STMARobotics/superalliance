import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/client/Home";
import Header from "./components/header";
import SignInPage from "./pages/handlers/login/page";
import { Show, useUser } from "@clerk/react";
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

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  if (user?.publicMetadata.role !== "admin") {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

function AppRouter() {
  const { loading } = useSuperAlliance();
  return (
    <Router>
      {/* HEADER */}
      <Header />
      <Routes>
        {/* CLIENT ROUTES */}
        <Route index element={<Home />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/login/*" element={<SignInPage />} />
        {/* NEW FORM ROUTES */}
        <Route
          path="/new/stand"
          element={
            <>
              <Show when="signed-in">
                <StandForm />
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </>
          }
        />
        <Route
          path="/new/comments"
          element={
            <>
              <Show when="signed-in">
                <CommentsForm />
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </>
          }
        />
        <Route
          path="/new/pit"
          element={
            <>
              <Show when="signed-in">
                <PitForm />
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </>
          }
        />
        {/* DATA ROUTES */}
        <Route
          path="/data/form/stand/:formId"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <DataStandForm />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <Navigate to="/data/forms" />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data/forms"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
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
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data/teams"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
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
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data/sorting"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
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
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data/team/projections"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
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
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/data/team/middlepath"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <DataMiddlePath />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        {/* ANALYSIS ROUTES */}
        <Route
          path="/analysis"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <Navigate to="/analysis/selection" />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/analysis/selection"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full relative">
              <Show when="signed-in">
                <AdminRoute>
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
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        {/* ADMINISTRATION ROUTES */}
        <Route
          path="/admin"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <Navigate to="/admin/settings" />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
            </div>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <div className="h-[calc(100vh-3.6rem)] w-full">
              <Show when="signed-in">
                <AdminRoute>
                  <AdministrationSettings />
                </AdminRoute>
              </Show>
              <Show when="signed-out">
                <Navigate to="/login" />
              </Show>
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
