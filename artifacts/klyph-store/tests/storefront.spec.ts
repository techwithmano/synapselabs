import { expect, test } from '@playwright/test';
import mongoose from 'mongoose';

test.afterAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  const connection = await mongoose.createConnection(uri).asPromise();
  try {
    const users = connection.collection('users');
    const orders = connection.collection('orders');
    const testUsers = await users
      .find({ email: /^synapse-e2e-[\w-]+@example\.test$/ })
      .project({ _id: 1 })
      .toArray();
    const ids = testUsers.map((user) => user._id);
    if (ids.length) {
      await orders.deleteMany({ user: { $in: ids } });
      await users.deleteMany({ _id: { $in: ids } });
    }
  } finally {
    await connection.close();
  }
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('text-price-synapse-core-ring')).toHaveText(
    '18 KWD',
    { timeout: 20_000 },
  );
});

test('loads the database-backed Synapse catalog and updates cart quantities', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Synapse Core Ring' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aura Spatial Clip' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'NeuroDock Magnetic Slate' })).toBeVisible();
  await expect(page.getByTestId('text-price-aura-spatial-clip')).toHaveText('26 KWD');
  await expect(page.getByTestId('text-price-neurodock-magnetic-slate')).toHaveText('14 KWD');

  await page.getByTestId('button-add-synapse-core-ring').click();
  await expect(page.getByTestId('cart-drawer')).toBeVisible();
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('18 KWD');
  await page.getByTestId('button-quantity-plus-synapse-core-ring').click();
  await expect(page.getByTestId('text-quantity-synapse-core-ring')).toHaveText('2');
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('36 KWD');
});

test('KWD and USD prices update in the catalog and cart', async ({ page }) => {
  await page.getByTestId('button-currency-usd').click();
  await expect(page.getByTestId('text-price-synapse-core-ring')).toHaveText('$59 USD');
  await expect(page.getByTestId('text-price-aura-spatial-clip')).toHaveText('$85 USD');
  await expect(page.getByTestId('text-price-neurodock-magnetic-slate')).toHaveText('$46 USD');

  await page.getByTestId('button-add-aura-spatial-clip').click();
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('$85 USD');
  await page
    .getByTestId('cart-drawer')
    .locator('.cart-currency-switch')
    .getByRole('button', { name: 'KWD' })
    .click();
  await expect(page.getByTestId('text-cart-subtotal')).toHaveText('26 KWD');
});

test('order APIs reject guests and the orders page sends guests to sign in', async ({
  page,
}) => {
  const response = await page.request.get('/api/orders');
  expect(response.status()).toBe(401);
  const checkoutResponse = await page.request.post('/api/checkout', {
    data: { items: [{ productId: '000000000000000000000000', quantity: 1 }], currency: 'kwd' },
  });
  expect(checkoutResponse.status()).toBe(401);

  await page.goto('/orders');
  await expect(page).toHaveURL(/\/login\?next=%2Forders$/);
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
});

test('cancel return opens the saved cart and prompts guests to sign in', async ({ page }) => {
  await page.getByTestId('button-add-synapse-core-ring').click();
  await page.getByTestId('button-close-cart').click();
  await page.goto('/cart');
  await expect(page.getByTestId('cart-drawer')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in to checkout' })).toHaveAttribute(
    'href',
    '/login?next=%2Fcart',
  );
});

test('checkout redirects to Stripe and account order history remains isolated', async ({
  page,
}) => {
  test.setTimeout(90_000);
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const firstEmail = `synapse-e2e-${unique}@example.test`;
  await page.goto('/signup');
  await page.getByLabel('Name').fill('Synapse Test One');
  await page.getByLabel('Email').fill(firstEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill('secure-test-password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
  await expect(page.getByRole('link', { name: 'My orders' })).toBeVisible();

  const sessionCookie = (await page.context().cookies()).find((cookie) => cookie.name === 'token');
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.sameSite).toBe('Lax');

  await page.getByTestId('button-add-synapse-core-ring').click();
  let checkoutPayload: { currency?: string; items?: { quantity: number }[] } | null = null;
  await page.route('**/api/checkout', async (route) => {
    checkoutPayload = route.request().postDataJSON() as typeof checkoutPayload;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'https://checkout.stripe.com/c/pay/cs_test_checkout_mock',
      }),
    });
  });
  await page.route('https://checkout.stripe.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>Hosted checkout mock</title>',
    });
  });
  await page.getByTestId('button-checkout').click();
  await expect(page).toHaveURL(/checkout\.stripe\.com/);
  await expect(page).toHaveTitle('Hosted checkout mock');
  expect(checkoutPayload).toMatchObject({
    currency: 'kwd',
    items: [{ quantity: 1 }],
  });

  await page.goto('/');
  const catalogResponse = await page.request.get('/api/products');
  expect(catalogResponse.ok()).toBeTruthy();
  const catalog = (await catalogResponse.json()) as { _id: string; name: string }[];
  const coreRing = catalog.find((product) => product.name === 'Synapse Core Ring');
  expect(coreRing).toBeTruthy();
  const orderResponse = await page.request.post('/api/orders', {
    data: { items: [{ productId: coreRing!._id, quantity: 1 }] },
  });
  expect(orderResponse.status()).toBe(201);

  const firstOrdersResponse = await page.request.get('/api/orders');
  expect(firstOrdersResponse.status()).toBe(200);
  const firstOrders = (await firstOrdersResponse.json()) as {
    orders: {
      total: number;
      currency: string;
      status: string;
      items: { price: number }[];
    }[];
  };
  expect(firstOrders.orders).toHaveLength(1);
  expect(firstOrders.orders[0]).toMatchObject({
    total: 18,
    currency: 'kwd',
    status: 'pending',
    items: [{ price: 18 }],
  });

  if (await page.getByTestId('button-close-cart').isVisible()) {
    await page.getByTestId('button-close-cart').click();
  }
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await page.goto('/signup');
  await page.getByLabel('Name').fill('Synapse Test Two');
  await page.getByLabel('Email').fill(`synapse-e2e-${unique}-second@example.test`);
  await page.getByRole('textbox', { name: 'Password' }).fill('secure-test-password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });

  const secondOrdersResponse = await page.request.get('/api/orders');
  expect(secondOrdersResponse.status()).toBe(200);
  const secondOrders = (await secondOrdersResponse.json()) as { orders: unknown[] };
  expect(secondOrders.orders).toEqual([]);

  await page.goto('/orders');
  await expect(page.getByRole('heading', { name: 'No orders yet' })).toBeVisible();
});

for (const width of [320, 375, 402, 768, 1023, 1024, 1440]) {
  test(`keeps content aligned without horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    const layout = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const outOfBounds = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
        .filter((element) => {
          const style = window.getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
            return false;
          }
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        })
        .map((element) => element.className || element.tagName.toLowerCase());

      const rect = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      };

      return {
        outOfBounds: [...new Set(outOfBounds)].slice(0, 12),
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth,
        heroCopy: rect('.hero-copy'),
        heroVisual: rect('.hero-visual-wrap'),
        cards: Array.from(document.querySelectorAll<HTMLElement>('.product-card')).map((card) => {
          const box = card.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        }),
      };
    });

    expect(layout.outOfBounds, `Elements should fit the ${width}px viewport`).toEqual([]);
    expect(layout.scrollWidth).toBe(layout.viewportWidth);
    expect(layout.heroCopy).not.toBeNull();
    expect(layout.heroVisual).not.toBeNull();
    if (width <= 760) {
      expect(layout.heroVisual!.top).toBeGreaterThanOrEqual(layout.heroCopy!.bottom - 1);
    } else {
      expect(layout.heroCopy!.right).toBeLessThanOrEqual(layout.heroVisual!.left + 1);
    }
    for (let index = 0; index < layout.cards.length; index += 1) {
      for (let other = index + 1; other < layout.cards.length; other += 1) {
        const leftCard = layout.cards[index];
        const rightCard = layout.cards[other];
        const overlaps =
          leftCard.left < rightCard.right &&
          leftCard.right > rightCard.left &&
          leftCard.top < rightCard.bottom &&
          leftCard.bottom > rightCard.top;
        expect(overlaps, `Product cards ${index} and ${other} should not overlap at ${width}px`).toBe(false);
      }
    }
  });
}
