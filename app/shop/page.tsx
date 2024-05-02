import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { getProducts } from 'lib/shopify';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function ShopPage({}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sortKey = 'TITLE'; // Sort products by title
  const reverse = false; // Sort in ascending order

  const products = await getProducts({ sortKey, reverse });

  return (
    <>
      {products.length > 0 ? (
        <Grid className="grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
