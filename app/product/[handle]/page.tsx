import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { GridTileImage } from 'components/grid/tile';
import ProductDescriptionLokal from 'components/product/product-description-lokal';
import ProductInfoBar from 'components/product/product-info-bar.client';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { default as Image, default as NextImage } from 'next/image';
import Link from 'next/link';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    images: product.images.map((image) => image.url),
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="relative pt-32 lg:pt-0 ">
        <div className="relative z-20 mx-auto w-full bg-white">
          <div className="relative grid h-auto w-full grid-cols-1 bg-gray-100 lg:h-screen lg:grid-cols-2">
            <div className="relative h-[60vh] w-full bg-slate-200 lg:h-full">
              <NextImage
                src={product.featuredImage.url}
                alt={product.featuredImage.altText}
                fill
                objectFit="cover"
              />
              {/* <NextImage src="/PosterFramedMain.jpg" fill objectFit="cover" alt="Poster" /> */}
            </div>
            <div className="relative h-[60vh] w-full bg-[#10514d] p-24 lg:h-full">
              <NextImage src={product.images[1]?.url} fill objectFit="cover" alt="Poster" />
            </div>
          </div>

          <div className="relative grid h-auto w-full grid-cols-1 bg-gray-100 pb-10 lg:h-[75vh] lg:grid-cols-8 ">
            <div className="relative col-span-1 h-[500px] w-full bg-slate-200 lg:col-span-2">
              <NextImage src={product.images[2]?.url} fill objectFit="cover" alt="Poster" />
            </div>
            <div className="col-span-1 lg:col-span-2 " />
            <div className="relative col-span-1 flex h-full max-w-xl items-center px-8 lg:col-span-4 lg:px-0">
              <ProductDescriptionLokal product={product} />
            </div>
          </div>

          <div className="relative grid w-full grid-cols-1 bg-gray-100 p-0 lg:grid-cols-8 lg:p-10">
            <div className="relative col-span-1 flex h-auto w-full flex-col gap-8 px-8 pb-8 lg:col-span-3 lg:h-[500px] lg:px-0 lg:pb-0 ">
              <p className="max-w-sm text-sm text-slate-700">
                Each Lokal Poster Collection is limited and will only be produced once. Collections
                are currated based on that season's color scheme and are limited to 500 of each
                size.
              </p>
              <p className="max-w-sm text-sm text-slate-700">
                We believe in creating pieces that will collected and valued for their scarcity.
              </p>
            </div>
            <div className="relative col-span-1 aspect-[1/1] h-full w-full bg-white p-24 lg:col-span-5">
              <NextImage src={product.images[3]?.url} fill objectFit="cover" alt="Poster" />
            </div>
          </div>

          <div className="sticky bottom-0 left-0 z-10 w-full p-0 lg:p-10 ">
            <ProductInfoBar product={product} />
          </div>

          <div className="px-4 lg:px-8">
            <Suspense>
              <RelatedProducts id={product.id} />
            </Suspense>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 flex h-[70vh] items-end justify-end bg-black p-2">
          <Image src="/LokalWordmark-White.svg" width={1500} height={0} alt="Lokal Poster Co" />
        </div>
      </div>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
