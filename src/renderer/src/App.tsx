import React, { JSX, useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Sidebar } from './components/core/Sidebar'
import { TitleBar } from './components/core/TitleBar'
import { useConfigStore } from './store/configProvider'
import { useTheme } from './components/core/ThemeProvider'
import { appRoutes } from './routes/appRoutes'
import { IAppRoute } from './interface/config.interface'
import { LoginTitleBar } from './components/core/LoginTitleBar'

// ================= TOKEN =================
const getToken = (): string | null => localStorage.getItem('token')

// ================= LOGIN ONLY LAYOUT =================
interface LoginOnlyLayoutProps {
  children: React.ReactNode
}

const LoginOnlyLayout = ({ children }: LoginOnlyLayoutProps): JSX.Element => {
  const token = getToken()

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <LoginTitleBar />
      </div>
      <main className="p-0 m-0 flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 overflow-auto">
        <div className="w-full h-full flex items-center justify-center">{children}</div>
      </main>
    </div>
  )
}

const NoSidebarLayout = ({ children }: LoginOnlyLayoutProps): JSX.Element => {
  // const location = useLocation()

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent): string => {
  //     e.preventDefault()
  //     e.returnValue = 'Apakah Anda yakin ingin meninggalkan ujian?'
  //     return 'Apakah Anda yakin ingin meninggalkan ujian?'
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [location])

  const { theme, setTheme } = useTheme()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TitleBar
        username={userData?.username || ''}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 bg-slate-100 dark:bg-black p-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
// ================= PROTECTED LAYOUT =================
interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps): JSX.Element => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// ================= SIDEBAR LAYOUT =================
interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: SidebarLayoutProps): JSX.Element => {
  const { theme, setTheme } = useTheme()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('userLogin')

    // Kirim event logout ke main process
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('logout')
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TitleBar
        username={userData?.username || ''}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 bg-slate-100 dark:bg-black p-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

// ================= ROUTE WRAPPER =================
const renderRoute = (route: IAppRoute, key: number): JSX.Element => {
  const { element, protected: isProtected, path } = route

  // PUBLIC (login) - khusus untuk login window
  if (!isProtected && path === '/login') {
    return <Route key={key} path={path} element={<LoginOnlyLayout>{element}</LoginOnlyLayout>} />
  }

  // PUBLIC (lainnya)
  if (!isProtected) {
    return <Route key={key} path={path} element={element} />
  }

  // (tanpa sidebar & titlebar)
  if (
    isProtected &&
    (path.startsWith('/scoring/xyz/') ||
      path.startsWith('/scoring2/xyz/') ||
      path.startsWith('/bracket/mirror/') ||
      path.startsWith('/waiting'))
  ) {
    return (
      <Route
        key={key}
        path={path}
        element={
          <ProtectedLayout>
            <NoSidebarLayout>{element}</NoSidebarLayout>
          </ProtectedLayout>
        }
      />
    )
  }

  // PROTECTED - DENGAN SIDEBAR LAYOUT (untuk route lainnya)
  return (
    <Route
      key={key}
      path={path}
      element={
        <ProtectedLayout>
          <SidebarLayout>{element}</SidebarLayout>
        </ProtectedLayout>
      }
    />
  )
}

// ================= APP =================
const App: React.FC = () => {
  const { fetchConfig, isLoading } = useConfigStore()

  // window.addEventListener('beforeunload', () => {
  //   localStorage.clear()
  // })
  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault()
        console.log('Ctrl+R pressed in renderer, restarting to login...')

        // Panggil API untuk restart ke login
        // if (window.api?.reload?.restartToLogin) {
        //   window.api.reload.restartToLogin()
        // }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )

  return (
    <>
      <Router>
        <Routes>
          {appRoutes.filter((r) => r.active).map((route, i) => renderRoute(route, i))}

          {/* 404 */}
          <Route
            path="*"
            element={
              <SidebarLayout>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-slate-600 dark:text-slate-400">Page Not Found</p>
                  </div>
                </div>
              </SidebarLayout>
            }
          />
        </Routes>
      </Router>

      <Toaster position="top-center" />
    </>
  )
}

export default App
