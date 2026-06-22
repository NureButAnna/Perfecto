import Hero        from './sections/Hero/Hero';
import About       from './sections/About/About';
import Stats       from './sections/Stats/Stats';
import Services    from './sections/Services/Services';
import HowItWorks  from './sections/HowItWorks/HowItWorks';
import Examples    from './sections/Examples/Examples';
import Reviews     from './sections/Reviews/Reviews';
import Location    from './sections/Location/Location';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Services />
      <HowItWorks />
      <Examples />
      <Reviews />
      <Location />
    </>
  );
}