import { getProduct } from 'lib/shopify';
import kbirdShopifyProducts from '../../profigure/components/settings/configs/kbird.shopify';
import DemoClient from './DemoClient';

export default async function DemoPage() {
  const productImages = {};

  await Promise.all(
    kbirdShopifyProducts.map(async ({handle}) => {
      const product = await getProduct(handle);
      if (product?.featuredImage) {
        productImages[handle] = product.featuredImage;
      }
    })
  );

  return <DemoClient productImages={productImages} />;
}
