import Shopify from 'shopify-api-node';

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE_NAME,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN
});

export async function createProduct({
  title,
  description,
  price,
  category,
  tags,
  imageBase64,
  imageMimeType
}) {
  const product = await shopify.product.create({
    title,
    body_html: description || '',
    vendor: 'Neutria',
    product_type: category || 'Other',
    tags: Array.isArray(tags) ? tags.join(',') : '',
    variants: [
      {
        price: String(price)
      }
    ],
    images: imageBase64
      ? [
          {
            attachment: imageBase64
          }
        ]
      : []
  });

  return product;
}
