import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('order buttons show Added feedback and open the local cart', async ({ page }) => {
  const orderButtons = [
    'button-hero-order',
    'button-pre-order',
    'button-add-pro',
    'button-add-air',
    'button-add-vault',
    'button-claim-allocation',
  ];

  for (const testId of orderButtons) {
    const button = page.getByTestId(testId);
    await button.click();
    await expect(button).toContainText('Added ✓');
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
    await page.getByTestId('button-close-cart').click();
  }
});

test('cart groups matching products, updates quantities, and recalculates subtotal', async ({
  page,
}) => {
  await page.getByTestId('button-add-pro').click();
  await page.getByTestId('button-close-cart').click();
  await page.getByTestId('button-add-pro').click();
  await page.getByTestId('button-close-cart').click();
  await page.getByTestId('button-add-air').click();

  await expect(page.getByTestId('text-cart-count')).toHaveText('3');
  await expect(
    page.getByTestId('row-cart-pro-matte-black'),
  ).toContainText('KLYPH Pro');
  await expect(page.getByTestId('text-quantity-pro')).toHaveText('2');
  await expect(page.getByTestId('text-quantity-air')).toHaveText('1');
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('74 KWD');

  await page.getByTestId('button-quantity-plus-air').click();
  await expect(page.getByTestId('text-quantity-air')).toHaveText('2');
  await expect(page.getByTestId('text-line-price-air')).toHaveText('32 KWD');
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('90 KWD');

  await page.getByTestId('button-quantity-minus-pro').click();
  await expect(page.getByTestId('text-quantity-pro')).toHaveText('1');
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('61 KWD');
});

test('KWD and USD pricing updates across catalog and cart totals', async ({ page }) => {
  await expect(page.getByTestId('text-price-pro')).toHaveText('29 KWD');
  await expect(page.getByTestId('text-price-air')).toHaveText('16 KWD');
  await expect(page.getByTestId('text-price-vault')).toHaveText('22 KWD');
  await expect(page.getByTestId('button-hero-order')).toContainText('29 KWD');

  await page.getByTestId('button-add-pro').click();
  await page.getByTestId('button-close-cart').click();
  await page.getByTestId('button-currency-usd').click();

  await expect(page.getByTestId('button-currency-usd')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByTestId('text-price-pro')).toHaveText('$95 USD');
  await expect(page.getByTestId('text-price-air')).toHaveText('$52 USD');
  await expect(page.getByTestId('text-price-vault')).toHaveText('$72 USD');
  await page.getByTestId('button-open-cart').click();
  await expect(page.getByTestId('text-line-price-pro')).toHaveText('$95 USD');
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('$95 USD');

  await page.getByTestId('button-close-cart').click();
  await page.getByTestId('button-currency-kwd').click();
  await page.getByTestId('button-open-cart').click();
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('29 KWD');
});

test('all finish swatches update the active finish and the selected cart variant', async ({
  page,
}) => {
  const finishes = [
    ['matte-black', 'Matte Black'],
    ['stealth-navy', 'Stealth Navy'],
    ['raw-titanium', 'Raw Titanium'],
  ] as const;

  for (const [slug, label] of finishes) {
    const swatch = page.getByTestId(`button-finish-pro-${slug}`);
    await swatch.click();
    await expect(swatch).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('text-finish-pro')).toHaveText(label);
  }

  await page.getByTestId('button-add-pro').click();
  await expect(page.getByTestId('row-cart-pro-raw-titanium')).toContainText(
    'Raw Titanium',
  );
});
