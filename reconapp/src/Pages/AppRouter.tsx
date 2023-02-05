import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom"
import { RequireAuth } from "react-auth-kit";

import LoginPage from './Client/LoginPage';
import Home from "./Client/Home";
import FourOhFour from "./Client/404";
import ReconForm from "./Client/ReconForm";
import FormSubmitted from "./Client/FormSubmitted";
import SubmissionsHome from "./Submissions/SubmissionsHome";
import SubmissionsTeams from "./Submissions/SubmissionsTeams";
import SubmissionsFormData from "./Submissions/SubmissionsFormData";
import SubmissionsFormView from "./Submissions/SubmissionsFormView";
import SubmissionsEvents from "./Submissions/SubmissionsEvents";
import SubmissionsEventData from "./Submissions/SubmissionsEventData";
import SubmissionsMatchData from "./Submissions/SubmissionsMatchData";
import SubmissionsMatchFormView from "./Submissions/SubmissionsMatchFormView";
import AnalyzedHome from "./Aggregations/AnalyzedHome";
import AnalyzedAverages from "./Aggregations/AnalyzedAverages";
import AnalyzedSorting from "./Aggregations/AnalyzedSorting";
import AnalyzedFiltering from "./Aggregations/AnalyzedFiltering";
import AnalyzedFormView from "./Aggregations/AnalyzedFormView";
import AdminPage from "./Admin/AdminPage";

function AppRouter() {

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RequireAuth loginPath="/login">
                            <Home />
                        </RequireAuth>
                    }
                ></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/404" element={
                    <RequireAuth loginPath="/login">
                        <FourOhFour />
                    </RequireAuth>
                }></Route>
                <Route path="/newform" element={
                    <RequireAuth loginPath="/login">
                        <ReconForm />
                    </RequireAuth>
                }></Route>
                <Route path="/formsubmitted" element={
                    <RequireAuth loginPath="/login">
                        <FormSubmitted />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsHome />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/teams" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsTeams />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/teams/:team" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsFormData />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/teams/:team/:submissionid" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsFormView />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/events" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsEvents />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/event/:eventId" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsEventData />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/event/:eventId/:matchId" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsMatchData />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/event/:eventId/:matchId/:submissionId" element={
                    <RequireAuth loginPath="/login">
                        <SubmissionsMatchFormView />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/analysis" element={
                    <RequireAuth loginPath="/login">
                        <AnalyzedHome />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/analysis/averages" element={
                    <RequireAuth loginPath="/login">
                        <AnalyzedAverages />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/analysis/sorting" element={
                    <RequireAuth loginPath="/login">
                        <AnalyzedSorting />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/analysis/filtering" element={
                    <RequireAuth loginPath="/login">
                        <AnalyzedFiltering />
                    </RequireAuth>
                }></Route>
                <Route path="/submissions/analysis/form/:submissionId" element={
                    <RequireAuth loginPath="/login">
                        <AnalyzedFormView />
                    </RequireAuth>
                }></Route>
                <Route path="/admin" element={
                    <RequireAuth loginPath="/login">
                        <AdminPage />
                    </RequireAuth>
                }></Route>
                <Route
                    path="*"
                    element={
                        <RequireAuth loginPath="/login">
                            <FourOhFour />
                        </RequireAuth>
                    }
                ></Route>
            </Routes>
        </Router>
    );
}

export default AppRouter;