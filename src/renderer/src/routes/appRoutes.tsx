import { IAppRoute } from '@renderer/interface/config.interface'
import { HomePage, LoginPage, ScoringPage } from '@renderer/pages'

export const appRoutes: IAppRoute[] = [
  // =============== PUBLIC ROUTES ===============
  { path: '/login', element: <LoginPage />, active: true, protected: false },
  // { path: '/logger', element: <LogViewerPage />, active: true, protected: false },

  // =============== PROTECTED ROUTES ===============
  { path: '/', element: <HomePage />, active: true, protected: true, redirectTo: '/login' },
  { path: '/scoring/:id', element: <ScoringPage />, active: true, protected: true }
  // { path: '*', element: <NotFoundPage />, active: true, protected: false }
]
