import { Product } from 'lib/shopify/types';

export default function ProductDescriptionLokal({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      <div className="mb-8 mt-6 flex w-full border-b-[1px] border-slate-400 pb-8">
        <div className="flex w-2/3 flex-col justify-between">
          <div className="flex flex-row items-center justify-between">
            <div className="w-1/2">
              <p className="text-xl text-gray-900">12.1234 N</p>
            </div>
            <div className="w-1/2">
              <p className="text-xl text-gray-900">43.4321 W</p>
            </div>
          </div>
          <p className="text-3xl text-gray-900 md:text-4xl lg:text-6xl">Dallas, TX</p>
        </div>
        <div className="flex w-1/3 flex-col gap-4">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-900">Area:</p>
            <p className="text-xl text-gray-900">123.4 sq Miles</p>
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-900">Population:</p>
            <p className="text-xl text-gray-900">1,234,232</p>
          </div>
        </div>
      </div>

      {/* {product.descriptionHtml ? (
        <Prose className="mb-6 leading-tight text-md" html={product.descriptionHtml} />
      ) : null} */}

      <p className="mb-8 max-w-xl text-lg text-slate-700">
        Museum-quality posters made on thick matte paper. Represent your city with a Lokal Poster.
      </p>

      <div className="mb-8 flex flex-col gap-4 border-b-[1px] border-stone-400 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <p className="text-sm text-slate-400">PAPER THICKNESS:</p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="text-sm text-slate-900">10.3 mill</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <p className="text-sm text-slate-400">PAPER WEIGHT:</p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="text-sm text-slate-900">189 g/m²</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <p className="text-sm text-slate-400">OPACITY:</p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="text-sm text-slate-900">94%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <p className="text-sm text-slate-400">ISO BRIGHTNESS:</p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="text-sm text-slate-900">104%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <p className="text-sm text-slate-400">PAPER SOURCE:</p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="text-sm text-slate-900">JAPAN</p>
          </div>
        </div>
      </div>

      <p className="max-w-xl text-sm text-slate-700">
        This product is crafted exclusively upon receipt of your order, necessitating a longer
        delivery period. Our commitment to on-demand production not only ensures exceptional quality
        but also aligns with our dedication to reducing overproduction.{' '}
      </p>
    </div>
  );
}
