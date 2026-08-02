import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
