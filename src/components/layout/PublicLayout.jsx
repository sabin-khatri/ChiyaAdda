import 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingSteam from '../ui/FloatingSteam'
import ThemeSelector from '../shared/ThemeSelector'
import AmbientSoundboard from '../shared/AmbientSoundboard'
import MotionProvider from '../../motion/MotionProvider'

const PublicLayout = () => {
  return (
    <MotionProvider>
      <div className="flex flex-col min-h-screen relative">
        <FloatingSteam />
        <Navbar />
        <main className="flex-grow w-full relative z-10 pt-nav-offset">
          <Outlet />
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
        <ThemeSelector />
        <AmbientSoundboard />
      </div>
    </MotionProvider>
  )
}

export default PublicLayout
