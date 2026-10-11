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
    await expect(button).toContainText('Added');
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

for (const width of [320, 375, 402, 768, 1023, 1024, 1440]) {
  test(`keeps visible content within the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const overflowingText = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      return Array.from(document.body.querySelectorAll<HTMLElement>('*'))
        .filter((element) => {
          if (!element.textContent?.trim()) return false;
          const style = window.getComputedStyle(element);
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            Number(style.opacity) === 0
          ) {
            return false;
          }

          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          return rect.left < -1 || rect.right > viewportWidth + 1;
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80),
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
        }))
        .slice(0, 10);
    });

    expect(
      overflowingText,
      `Visible text should stay within the ${width}px viewport`,
    ).toEqual([]);
    await expect(page.locator('html')).toHaveJSProperty(
      'scrollWidth',
      await page.evaluate(() => document.documentElement.clientWidth),
    );

    const comparisonCards = page.locator(
      '#comparison [aria-label="Comparison metrics"]',
    );
    const comparisonTable = page.getByTestId('table-comparison');
    if (width < 1024) {
      await expect(comparisonCards).toBeVisible();
      await expect(comparisonTable).toBeHidden();
    } else {
      await expect(comparisonCards).toBeHidden();
      await expect(comparisonTable).toBeVisible();
    }
  });
}
