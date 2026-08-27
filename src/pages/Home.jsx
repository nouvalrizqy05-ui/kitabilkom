import useIsMobile from '../hooks/useIsMobile';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

export default function Home() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <HomeMobile />;
  }

  return <HomeDesktop />;
}
