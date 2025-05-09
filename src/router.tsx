import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

import { lazy } from "react";

const MainPage = lazy(() => import("./pages/main/MainPage"));
const PartyCreatedPage = lazy(
	() => import("./pages/party-created/PartyCreatedPage"),
);
const JoinPage = lazy(() => import("./pages/join/JoinPage"));
const ProgressPage = lazy(() => import("./pages/progress/ProgressPage"));
const RecommendPage = lazy(() => import("./pages/recommand/RecommandPage"));
const SurveyPage = lazy(() => import("./pages/survey/SurveyPage"));

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<MainPage />} />
			<Route path="/party-created" element={<PartyCreatedPage />} />
			<Route path="/join" element={<JoinPage />} />
			<Route path="/progress" element={<ProgressPage />} />
			<Route path="/recommand" element={<RecommendPage />} />
			<Route path="/survey" element={<SurveyPage />} />
		</>,
	),
);
