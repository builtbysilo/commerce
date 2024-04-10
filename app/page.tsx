import CustomCursor from 'components/customcursor';
import Gallery from 'components/gallery';

export default function Home() {
  return (
    <div className="">
      <div className="hidden md:inline">
        <CustomCursor />
      </div>

      <div className="hidden md:inline">
        <Gallery
          scale={5}
          topCon={0.1}
          bottomCon={0.11}
          leftCon={0.4}
          rightCon={0.4}
          startX={'200%'}
          startY={'-60%'}
        />
      </div>
      <div className="inline md:hidden">
        <Gallery
          scale={8}
          topCon={0.05}
          bottomCon={0.08}
          leftCon={0.45}
          rightCon={0.45}
          startX={'290%'}
          startY={'-50%'}
        />
      </div>
    </div>
  );
}
