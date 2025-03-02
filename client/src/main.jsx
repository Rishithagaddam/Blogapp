import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Rootlayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import AuthorProfile from './components/author/AuthorProfile.jsx';
import Articles from './components/common/Articles.jsx';
import ArticleByID from './components/common/ArticleByID.jsx';
import AddArticle from './components/author/AddArticle.jsx';
import UserAuthorContext from './contexts/UserAuthorContext.jsx';
import { DarkModeProvider } from './contexts/DarkModeContext';
import AdminProfile from './components/admin/AdminProfile.jsx';
import UsersnAuthors from './components/admin/UsersnAuthors.jsx';
import { Toaster } from 'react-hot-toast';
import SSOCallback from './components/common/SSOCallback.jsx';


const browserRouterObj = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "signin",
        element: <Signin />
      },
      {
        path: "signup",
        element: <Signup />
      },
      { path: "signup/sso-callback", element: <SSOCallback /> },
      { path: "signin/sso-callback", element: <SSOCallback /> },
      {
        path: "user-profile/:email",
        element: <UserProfile />,
        children: [
          {
            path: "articles",
            element: <Articles />
          },
          {
            path: ":articleId",
            element: <ArticleByID />
          },
          {
            path: "",
            element: <Navigate to="articles" />
          }
        ]
      },
      {
        path: "author-profile/:email",
        element: <AuthorProfile />,
        children: [
          {
            path: "articles",
            element: <Articles />
          },
          {
            path: ":articleId",
            element: <ArticleByID />
          },
          {
            path: "",
            element: <Navigate to="articles" />
          }
        ]
      },
      {
        path: "articles/add-article",
        element: <AddArticle />
      },
      {
        path: "admin-profile/:email",
        element: <AdminProfile />,
        children: [
          {
            index: true,
            element: <UsersnAuthors />
          },
          {
            path: "usersnauthors",
            element: <UsersnAuthors />
          }
        ]
      },
      {
        path: "/articles",
        element: <Articles />
      },
      {
        path: "/article/:articleId",
        element: <ArticleByID />
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <UserAuthorContext>
        <RouterProvider router={browserRouterObj} future={{
          v7_startTransition: true,
        }} />
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#EAEAEA',
            border: '1px solid #333',
          },
        }} />
      </UserAuthorContext>
    </DarkModeProvider>
  </StrictMode>,
);
