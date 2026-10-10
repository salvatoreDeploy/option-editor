import { Route, Router } from 'electron-router-dom'
import { Blank } from './pages/blank'
import { Document } from './pages/document'
import { Settings } from './pages/settings'
import { Profile } from './pages/profile'
import { Default } from './pages/layout/default'

export function Routes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Default />}>
            <Route path="/" element={<Blank />} />
            <Route path="/document/:id" element={<Document />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </>
      }
    />
  )
}
