import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RequireAuth, RequireCreator } from "./components/layout/guards";
import { useI18n } from "./i18n/i18n-context";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Search = lazy(() => import("./pages/Search"));
const Auth = lazy(() => import("./pages/Auth"));
const Categories = lazy(() => import("./pages/Categories"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const VideoDetails = lazy(() => import("./pages/VideoDetails"));
const Watch = lazy(() => import("./pages/Watch"));
const CreatorPage = lazy(() => import("./pages/CreatorPage"));
const Library = lazy(() => import("./pages/Library"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BecomeCreator = lazy(() => import("./pages/BecomeCreator"));
const Studio = lazy(() => import("./pages/Studio"));
const CourseEditor = lazy(() => import("./pages/CourseEditor"));
const VideoEditor = lazy(() => import("./pages/VideoEditor"));
const MapPage = lazy(() => import("./pages/MapPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Fallback() {
  const { t } = useI18n();
  return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" role="status"><span className="text-muted">{t("common.loading")}</span></div>;
}
const LoginRedirect = () => <Navigate to={`/signin${useLocation().search}`} replace />;
function CategoryRedirect() {
  const { id } = useParams();
  return <Navigate to={`/explore?category=${encodeURIComponent(id ?? "")}`} replace />;
}
function CreatorRedirect() {
  const { id } = useParams();
  return <Navigate to={`/creator/${id}`} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* full-screen surfaces */}
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<Auth mode="signin" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/login" element={<LoginRedirect />} />
        {/* every route that plays video is behind RequireAuth, and Watch re-checks */}
        <Route path="/course/:id/learn" element={<RequireAuth><Watch kind="course" /></RequireAuth>} />
        <Route path="/video/:id/watch" element={<RequireAuth><Watch kind="video" /></RequireAuth>} />

        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryRedirect />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/video/:id" element={<VideoDetails />} />
          <Route path="/creator/:id" element={<CreatorPage />} />
          <Route path="/provider/:id" element={<CreatorRedirect />} />
          <Route path="/library" element={<Library />} />
          <Route path="/saved" element={<Navigate to="/library" replace />} />
          <Route path="/history" element={<Navigate to="/library?tab=recent" replace />} />
          <Route path="/my-learning" element={<Navigate to="/library" replace />} />
          <Route path="/enrollments" element={<Navigate to="/library" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/become-creator" element={<BecomeCreator />} />
          <Route path="/studio" element={<RequireCreator><Studio /></RequireCreator>} />
          <Route path="/studio/courses/new" element={<RequireCreator><CourseEditor /></RequireCreator>} />
          <Route path="/studio/courses/:id" element={<RequireCreator><CourseEditor /></RequireCreator>} />
          <Route path="/studio/videos/new" element={<RequireCreator><VideoEditor /></RequireCreator>} />
          <Route path="/studio/videos/:id" element={<RequireCreator><VideoEditor /></RequireCreator>} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
