import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import { ThemeProvider } from './pages/theme/theme-provider';

import { Toaster } from 'sonner';
import { Error } from './pages/error';
import { Home } from './pages/home';
import { LoadingPage } from './utils/loading-page';
import { StarryLayout } from './pages/ui/StarryLayout';
import { Quiz } from './pages/quiz';
export function App() {

  return (

    <>

  <ThemeProvider storageKey='sym' defaultTheme='dark'>
    <StarryLayout>
      <Toaster position='top-center' className='bg-[#171717]' />
        <Router>
            <Routes>

              <Route path='/loading' element={<LoadingPage/>}/>

              <Route path='/' element={<Home/>}/>

              <Route path='/quiz' element={<Quiz/>}/>

              <Route path='/' element={<Home/>}/>

              <Route path='*' element={<Error />} />

            </Routes>
        </Router>
      </StarryLayout>
  </ThemeProvider>
    </>
  
)
}

