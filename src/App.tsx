import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const MapPage = lazy(() => import("./pages/MapPage"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const ProviderPage = lazy(() => import("./pages/Provider"));
const CoursePlayer = lazy(() => import("./pages/CoursePlayer"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const Saved = lazy(() => import("./pages/Saved"));
const Enrollments = lazy(() => import("./pages/Enrollments"));
const HistoryPage = lazy(() => import("./pages/History"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));


function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center py-24">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-base-border2 border-t-orival" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/course/:id/learn" element={<CoursePlayer />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/provider/:id" element={<ProviderPage />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
