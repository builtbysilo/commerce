import CustomCursor from 'components/customcursor';
import Gallery from 'components/gallery';

export default function Home() {
  return (
    <div className="">
      <CustomCursor />
      <div className="hidden md:inline">
        <Gallery scale={5} />
      </div>
      <div className="inline md:hidden">
        <Gallery scale={10} />
      </div>
    </div>
  );
}
