import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, 'db.json');
const UPLOAD_DIR = path.resolve(__dirname, '../public/images/products');

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], products: [], orders: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return { users: [], products: [], orders: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protect against gigantic payloads (10MB max)
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Email');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req, res) {
  const urlObj = new URL(req.url, 'http://localhost');
  const pathname = urlObj.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Email');
    res.end();
    return true;
  }

  if (!pathname.startsWith('/api')) {
    return false; // not an API route
  }

  const db = readDb();

  // -------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------

  // POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { email, password } = body;
    if (!email || !password) {
      sendJson(res, 400, { error: 'E-mail e senha são obrigatórios.' });
      return true;
    }

    const user = db.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      sendJson(res, 401, { error: 'Credenciais inválidas. Verifique o e-mail ou a senha.' });
      return true;
    }

    const { password: _, ...userSafe } = user;
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    sendJson(res, 200, { user: userSafe, token });
    return true;
  }

  // POST /api/auth/register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      sendJson(res, 400, { error: 'Nome, e-mail e senha são obrigatórios.' });
      return true;
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      sendJson(res, 409, { error: 'Já existe uma conta registada com este e-mail.' });
      return true;
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    const { password: _, ...userSafe } = newUser;
    const token = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString('base64');
    sendJson(res, 201, { user: userSafe, token });
    return true;
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && method === 'GET') {
    const emailHeader = req.headers['x-user-email'] || urlObj.searchParams.get('email');
    if (!emailHeader) {
      sendJson(res, 401, { error: 'Não autenticado' });
      return true;
    }

    const user = db.users.find(u => u.email.toLowerCase() === emailHeader.toLowerCase());
    if (!user) {
      sendJson(res, 404, { error: 'Utilizador não encontrado' });
      return true;
    }

    const { password: _, ...userSafe } = user;
    sendJson(res, 200, { user: userSafe });
    return true;
  }

  // -------------------------------------------------------------
  // ORDERS ROUTES
  // -------------------------------------------------------------

  // GET /api/orders
  if (pathname === '/api/orders' && method === 'GET') {
    const userEmail = req.headers['x-user-email'] || urlObj.searchParams.get('email');
    const isAdmin = urlObj.searchParams.get('all') === 'true' || req.headers['x-user-role'] === 'admin';

    if (isAdmin) {
      // Return all orders sorted by date descending
      const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      sendJson(res, 200, { orders: sorted });
      return true;
    }

    if (!userEmail) {
      sendJson(res, 200, { orders: [] });
      return true;
    }

    const userOrders = db.orders
      .filter(o => o.customerEmail && o.customerEmail.toLowerCase() === userEmail.toLowerCase())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sendJson(res, 200, { orders: userOrders });
    return true;
  }

  // POST /api/orders
  if (pathname === '/api/orders' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { items, subtotal, shippingCost, total, shippingAddress, customerName, customerEmail, userId } = body;

    if (!items || !items.length) {
      sendJson(res, 400, { error: 'A encomenda deve conter pelo menos um item.' });
      return true;
    }

    const newOrder = {
      id: body.id || `FLS-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: userId || null,
      customerName: customerName || shippingAddress?.fullName || 'Cliente Falstep',
      customerEmail: (customerEmail || shippingAddress?.email || '').toLowerCase(),
      items: items.map(it => ({
        id: it.id,
        title: it.title,
        price: it.price,
        size: it.size || it.selectedSize || 'L',
        qty: it.qty || it.quantity || 1,
        image: it.image
      })),
      subtotal: Number(subtotal || 0),
      shippingCost: Number(shippingCost || 0),
      total: Number(total || 0),
      shippingAddress: shippingAddress || {},
      status: 'Confirmado',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    writeDb(db);

    sendJson(res, 201, { order: newOrder, success: true });
    return true;
  }

  // PATCH /api/orders/:id (Update status, tracking, notes)
  if (pathname.startsWith('/api/orders/') && method === 'PATCH') {
    const orderId = pathname.replace('/api/orders/', '');
    const body = await parseJsonBody(req);
    const { status, trackingCode, carrier, adminNotes } = body;

    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      sendJson(res, 404, { error: 'Encomenda não encontrada' });
      return true;
    }

    if (status !== undefined) order.status = status;
    if (trackingCode !== undefined) order.trackingCode = trackingCode;
    if (carrier !== undefined) order.carrier = carrier;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    order.updatedAt = new Date().toISOString();

    writeDb(db);
    sendJson(res, 200, { order, success: true });
    return true;
  }

  // -------------------------------------------------------------
  // FILE UPLOAD ROUTE (Admin import image from machine)
  // -------------------------------------------------------------
  if (pathname === '/api/upload' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { filename, base64 } = body;

      if (!base64) {
        sendJson(res, 400, { error: 'Dados do ficheiro em base64 não fornecidos.' });
        return true;
      }

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      let ext = '.png';

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('svg')) ext = '.svg';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64, 'base64');
      }

      const cleanBase = (filename || 'produto').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 35);
      const safeFilename = `upload_${Date.now()}_${cleanBase}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/images/products/${safeFilename}`;
      sendJson(res, 200, { success: true, url: publicUrl, filename: safeFilename });
      return true;
    } catch (err) {
      console.error('Upload error:', err);
      sendJson(res, 500, { error: 'Falha ao guardar ficheiro: ' + err.message });
      return true;
    }
  }

  // -------------------------------------------------------------
  // PRODUCTS ROUTES
  // -------------------------------------------------------------

  // GET /api/products
  if (pathname === '/api/products' && method === 'GET') {
    sendJson(res, 200, { products: db.products || [] });
    return true;
  }

  // POST /api/products (Admin)
  if (pathname === '/api/products' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { title, subtitle, price, category, color, edition, image, gallery, description, specs, sizes } = body;

    if (!title || !price) {
      sendJson(res, 400, { error: 'Título e preço são obrigatórios.' });
      return true;
    }

    const cleanId = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      id: cleanId,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : 'Heavyweight Streetwear Silhouette',
      price: Number(price),
      color: color || 'Onyx Black',
      category: category || 'T-SHIRTS',
      sizes: sizes && sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
      edition: edition || 'LIMITED RUN // 150 PIECES',
      image: image || '/images/products/hero_david_feroz_black.jpg',
      gallery: gallery && gallery.length ? gallery : [image || '/images/products/hero_david_feroz_black.jpg'],
      description: description || 'Peça esculpida em malha pesada portuguesa com caimento boxy arquitetónico.',
      specs: specs || {
        origin: 'Porto, Portugal',
        weight: '320 GSM',
        composition: '100% Algodão Orgânico',
        treatment: 'Lavagem Enzimática a Frio'
      },
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    writeDb(db);

    sendJson(res, 201, { product: newProduct, success: true });
    return true;
  }

  // PATCH /api/products/:id (Admin edit product)
  if (pathname.startsWith('/api/products/') && method === 'PATCH') {
    const prodId = pathname.replace('/api/products/', '');
    const index = db.products.findIndex(p => p.id === prodId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Produto não encontrado.' });
      return true;
    }

    const body = await parseJsonBody(req);
    const existing = db.products[index];

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    if (body.price !== undefined) {
      updated.price = Number(body.price);
    }

    db.products[index] = updated;
    writeDb(db);
    sendJson(res, 200, { success: true, product: updated });
    return true;
  }

  // POST /api/products/:id/clone (Admin duplicate product)
  if (pathname.startsWith('/api/products/') && pathname.endsWith('/clone') && method === 'POST') {
    const prodId = pathname.replace('/api/products/', '').replace('/clone', '');
    const origin = db.products.find(p => p.id === prodId);
    if (!origin) {
      sendJson(res, 404, { error: 'Produto de origem não encontrado.' });
      return true;
    }

    const cloned = {
      ...origin,
      id: `clone_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${origin.title} (Cópia)`,
      sku: `FS-CP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };

    db.products.unshift(cloned);
    writeDb(db);
    sendJson(res, 201, { success: true, product: cloned });
    return true;
  }

  // DELETE /api/products/:id (Admin)
  if (pathname.startsWith('/api/products/') && method === 'DELETE') {
    const prodId = pathname.replace('/api/products/', '');
    const index = db.products.findIndex(p => p.id === prodId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Produto não encontrado.' });
      return true;
    }

    const removed = db.products.splice(index, 1);
    writeDb(db);
    sendJson(res, 200, { success: true, removed: removed[0] });
    return true;
  }

  // -------------------------------------------------------------
  // COLLECTIONS / CATALOGS ROUTES
  // -------------------------------------------------------------
  if (pathname === '/api/collections' && method === 'GET') {
    sendJson(res, 200, { collections: db.collections || [] });
    return true;
  }

  if (pathname === '/api/collections' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { name, tagline, cover, badge, status, productIds } = body;
    if (!name) {
      sendJson(res, 400, { error: 'O nome da coleção é obrigatório.' });
      return true;
    }

    const newCollection = {
      id: `col_${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      tagline: tagline || '',
      cover: cover || '/images/products/hero_david_feroz_black.jpg',
      badge: badge || 'NOVO LANÇAMENTO',
      status: status || 'active',
      productIds: Array.isArray(productIds) ? productIds : [],
      createdAt: new Date().toISOString()
    };

    if (!db.collections) db.collections = [];
    db.collections.unshift(newCollection);
    writeDb(db);
    sendJson(res, 201, { success: true, collection: newCollection });
    return true;
  }

  if (pathname.startsWith('/api/collections/') && method === 'PATCH') {
    const colId = pathname.replace('/api/collections/', '');
    const body = await parseJsonBody(req);
    const index = (db.collections || []).findIndex(c => c.id === colId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Coleção não encontrada.' });
      return true;
    }

    db.collections[index] = { ...db.collections[index], ...body, id: colId, updatedAt: new Date().toISOString() };
    writeDb(db);
    sendJson(res, 200, { success: true, collection: db.collections[index] });
    return true;
  }

  if (pathname.startsWith('/api/collections/') && method === 'DELETE') {
    const colId = pathname.replace('/api/collections/', '');
    const index = (db.collections || []).findIndex(c => c.id === colId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Coleção não encontrada.' });
      return true;
    }

    db.collections.splice(index, 1);
    writeDb(db);
    sendJson(res, 200, { success: true, message: 'Coleção removida com sucesso.' });
    return true;
  }

  // -------------------------------------------------------------
  // COUPONS ROUTES (Admin discounts management)
  // -------------------------------------------------------------
  if (pathname === '/api/coupons' && method === 'GET') {
    sendJson(res, 200, { coupons: db.coupons || [] });
    return true;
  }

  if (pathname === '/api/coupons' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { code, type, value, minSpend, maxUsage } = body;
    if (!code || !value) {
      sendJson(res, 400, { error: 'Código e valor do cupom são obrigatórios.' });
      return true;
    }

    const newCoupon = {
      id: `coup_${Date.now()}`,
      code: code.trim().toUpperCase(),
      type: type || 'percentage',
      value: Number(value),
      minSpend: Number(minSpend) || 0,
      usageCount: 0,
      maxUsage: Number(maxUsage) || 100,
      active: true,
      createdAt: new Date().toISOString()
    };

    if (!db.coupons) db.coupons = [];
    db.coupons.unshift(newCoupon);
    writeDb(db);
    sendJson(res, 201, { success: true, coupon: newCoupon });
    return true;
  }

  if (pathname.startsWith('/api/coupons/') && method === 'PATCH') {
    const coupId = pathname.replace('/api/coupons/', '');
    const body = await parseJsonBody(req);
    const index = (db.coupons || []).findIndex(c => c.id === coupId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Cupom não encontrado.' });
      return true;
    }

    db.coupons[index] = { ...db.coupons[index], ...body, id: coupId };
    writeDb(db);
    sendJson(res, 200, { success: true, coupon: db.coupons[index] });
    return true;
  }

  if (pathname.startsWith('/api/coupons/') && method === 'DELETE') {
    const coupId = pathname.replace('/api/coupons/', '');
    const index = (db.coupons || []).findIndex(c => c.id === coupId);
    if (index === -1) {
      sendJson(res, 404, { error: 'Cupom não encontrado.' });
      return true;
    }

    db.coupons.splice(index, 1);
    writeDb(db);
    sendJson(res, 200, { success: true, message: 'Cupom removido com sucesso.' });
    return true;
  }

  if (pathname === '/api/coupons/validate' && method === 'POST') {
    const body = await parseJsonBody(req);
    const { code, cartSubtotal } = body;
    const clean = (code || '').trim().toUpperCase();

    const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === clean);
    if (!coupon) {
      sendJson(res, 404, { error: 'Código de cupom inválido.' });
      return true;
    }

    if (!coupon.active) {
      sendJson(res, 400, { error: 'Este cupom encontra-se inativo.' });
      return true;
    }

    if (coupon.usageCount >= coupon.maxUsage) {
      sendJson(res, 400, { error: 'Este cupom atingiu o limite máximo de utilizações.' });
      return true;
    }

    if (cartSubtotal && coupon.minSpend && Number(cartSubtotal) < coupon.minSpend) {
      sendJson(res, 400, { error: `Compra mínima de €${coupon.minSpend} exigida para aplicar este cupom.` });
      return true;
    }

    sendJson(res, 200, {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    });
    return true;
  }

  // DELETE /api/users/:id (Admin remove client)
  if (pathname.startsWith('/api/users/') && method === 'DELETE') {
    const userId = pathname.replace('/api/users/', '');
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      sendJson(res, 404, { error: 'Utilizador não encontrado.' });
      return true;
    }

    const targetUser = db.users[userIndex];
    if (targetUser.role === 'admin' || targetUser.email.toLowerCase() === 'admin@falstep.com') {
      sendJson(res, 403, { error: 'Não é permitido remover a conta de administrador.' });
      return true;
    }

    const removed = db.users.splice(userIndex, 1);
    writeDb(db);
    sendJson(res, 200, {
      success: true,
      message: `Cliente ${targetUser.name} (${targetUser.email}) removido com sucesso.`,
      removed: { id: targetUser.id, name: targetUser.name, email: targetUser.email }
    });
    return true;
  }

  // GET /api/settings
  if (pathname === '/api/settings' && method === 'GET') {
    if (!db.settings) {
      db.settings = {
        announcement: 'PORTUGUESE HEAVYWEIGHT TEXTILES // ENVIOS PARA TODO O MUNDO // DROP 07 DISPONÍVEL',
        heroBadge: 'DROP 07 // FEROZ SAVAGE CAPSULE',
        heroTitle: 'FEROZ SAVAGE &\nDIAMOND DIET',
        heroSubtitle: 'Classical sculpture reimagined through contemporary underground brutalism. Heavyweight 320 GSM boxy proportions sculpted from bespoke Portuguese milled textiles.',
        freeShippingThreshold: 100,
        contactEmail: 'atelier@falstep.com',
        contactPhone: '+351 912 345 678'
      };
      writeDb(db);
    }
    sendJson(res, 200, { settings: db.settings });
    return true;
  }

  // PATCH /api/settings (Admin edit store settings)
  if (pathname === '/api/settings' && method === 'PATCH') {
    const body = await parseJsonBody(req);
    db.settings = {
      ...(db.settings || {}),
      ...body
    };
    writeDb(db);
    sendJson(res, 200, { success: true, settings: db.settings });
    return true;
  }

  // -------------------------------------------------------------
  // ADMIN STATS / USERS
  // -------------------------------------------------------------
  if (pathname === '/api/admin/stats' && method === 'GET') {
    const totalRevenue = db.orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalOrders = db.orders.length;
    const totalUsers = db.users.length;
    const totalProducts = db.products.length;

    sendJson(res, 200, {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders: [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      users: db.users.map(({ password, ...u }) => u)
    });
    return true;
  }

  // 404 for other API routes
  sendJson(res, 404, { error: 'Endpoint da API não encontrado' });
  return true;
}
