import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import AdminRoute from "@/components/auth/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Association from "./pages/Association";
import NosActions from "./pages/NosActions";
import Soutenir from "./pages/Soutenir";
import Contact from "./pages/Contact";
import Actualites from "./pages/Actualites";
import Projets from "./pages/Projets";
import Temoignages from "./pages/Temoignages";
import FAQ from "./pages/FAQ";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostForm from "./pages/admin/PostForm";
import Events from "./pages/admin/Events";
import EventForm from "./pages/admin/EventForm";
import Activities from "./pages/admin/Activities";
import ActivityForm from "./pages/admin/ActivityForm";
import Messages from "./pages/admin/Messages";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Pages from "./pages/admin/Pages";
import PageForm from "./pages/admin/PageForm";
import Testimonials from "./pages/admin/Testimonials";
import TestimonialForm from "./pages/admin/TestimonialForm";
import Permissions from "./pages/admin/Permissions";
import ValidationQueue from "./pages/admin/ValidationQueue";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfile from "./pages/member/MemberProfile";
import Community from "./pages/member/Community";
import Documents from "./pages/member/Documents";
import MemberDirectory from "./pages/member/MemberDirectory";
import MemberEvents from "./pages/member/MemberEvents";
import MemberActivities from "./pages/member/MemberActivities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/association" element={<Association />} />
            <Route path="/nos-actions" element={<NosActions />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/temoignages" element={<Temoignages />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/auth" element={<Auth />} />

            {/* Member routes - any authenticated user */}
            <Route
              path="/membre"
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/profil"
              element={
                <ProtectedRoute>
                  <MemberProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/communaute"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/annuaire"
              element={
                <ProtectedRoute>
                  <MemberDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/evenements"
              element={
                <ProtectedRoute>
                  <MemberEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membre/ateliers"
              element={
                <ProtectedRoute>
                  <MemberActivities />
                </ProtectedRoute>
              }
            />

            {/* Admin routes - Dashboard accessible by all roles */}
            <Route
              path="/admin"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <Dashboard />
                </AdminRoute>
              }
            />
            {/* Validation Queue */}
            <Route
              path="/admin/validation"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <ValidationQueue />
                </AdminRoute>
              }
            />
            {/* Posts - admin and editor only */}
            <Route
              path="/admin/posts"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <Posts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <PostForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/:id"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <PostForm />
                </AdminRoute>
              }
            />
            {/* Events - admin, editor, and animator */}
            <Route
              path="/admin/events"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <Events />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/events/new"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <EventForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/events/:id"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <EventForm />
                </AdminRoute>
              }
            />
            {/* Activities - admin, editor, and animator */}
            <Route
              path="/admin/activities"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <Activities />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/activities/new"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <ActivityForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/activities/:id"
              element={
                <AdminRoute allowedRoles={['admin', 'editor', 'animator']}>
                  <ActivityForm />
                </AdminRoute>
              }
            />
            {/* Messages - admin and editor only */}
            <Route
              path="/admin/messages"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <Messages />
                </AdminRoute>
              }
            />
            {/* Users - admin only */}
            <Route
              path="/admin/users"
              element={
                <AdminRoute allowedRoles={['admin']}>
                  <Users />
                </AdminRoute>
              }
            />
            {/* Permissions - admin only */}
            <Route
              path="/admin/permissions"
              element={
                <AdminRoute allowedRoles={['admin']}>
                  <Permissions />
                </AdminRoute>
              }
            />
            {/* Settings - admin only */}
            <Route
              path="/admin/settings"
              element={
                <AdminRoute allowedRoles={['admin']}>
                  <Settings />
                </AdminRoute>
              }
            />
            {/* Pages - admin and editor only */}
            <Route
              path="/admin/pages"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <Pages />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/new"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <PageForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/:id"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <PageForm />
                </AdminRoute>
              }
            />
            {/* Testimonials - admin and editor only */}
            <Route
              path="/admin/testimonials"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <Testimonials />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/testimonials/new"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <TestimonialForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/testimonials/:id"
              element={
                <AdminRoute allowedRoles={['admin', 'editor']}>
                  <TestimonialForm />
                </AdminRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
