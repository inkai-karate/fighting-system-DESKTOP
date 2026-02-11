import { IAppRoute } from '@renderer/interface/config.interface'
import {
  BracketScreenPage,
  BracketScreenPageDisplayPage,
  DetailEventPage,
  EventPage,
  HistoryPage,
  HomePage,
  LoginPage,
  ScoringDisplayPage,
  ScoringPage,
  ScoringPage2,
  WaitingPage
} from '@renderer/pages'

export const appRoutes: IAppRoute[] = [
  // =============== PUBLIC ROUTES ===============
  { path: '/login', element: <LoginPage />, active: true, protected: false },
  // { path: '/logger', element: <LogViewerPage />, active: true, protected: false },

  // =============== PROTECTED ROUTES ===============
  { path: '/', element: <HomePage />, active: true, protected: true, redirectTo: '/login' },
  { path: '/waiting', element: <WaitingPage />, active: true, protected: false },

  { path: '/scoring/xyz/:id', element: <ScoringPage2 />, active: true, protected: true },
  { path: '/scoring2/xyz/:id', element: <ScoringPage />, active: true, protected: true },
  { path: '/scoring/mirror/:id', element: <ScoringDisplayPage />, active: true, protected: false },
  { path: '/scoring/history/:id', element: <HistoryPage />, active: true, protected: true },

  { path: '/bracket/:id', element: <BracketScreenPage />, active: true, protected: true },
  {
    path: '/bracket/mirror/:id',
    element: <BracketScreenPageDisplayPage />,
    active: true,
    protected: true
  },

  { path: '/event', element: <EventPage />, active: true, protected: true },
  { path: '/event/detail/:id', element: <DetailEventPage />, active: true, protected: true }

  // { path: '*', element: <NotFoundPage />, active: true, protected: false }
]
