import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

const CATEGORIES = ['bags', 'flowers', 'clothing', 'baby', 'home'];

function requireAdmin(request: NextRequest): boolean {
  return getSessionFromRequest(request.headers.get('cookie'));
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured. Add SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY to .env.local' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, category, description, image, price_paise, in_stock, sort_order } = body;

    if (!name || !category || !description || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, description, image' },
        { status: 400 }
      );
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Category must be one of: ${CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    const price = parseInt(String(price_paise || 0), 10);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: String(name).trim(),
        category,
        description: String(description).trim(),
        image: String(image).trim(),
        price_paise: price,
        in_stock: in_stock !== false,
        sort_order: parseInt(String(sort_order || 0), 10) || 0,
      })
      .select('id, name, category, price_paise')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to add product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    console.error('Add product error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: msg.includes('JSON') ? 'Invalid request body' : `Error: ${msg}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Supabase products fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (data || []) as Array<Record<string, unknown>>;
    list.sort((a, b) => (Number(a.sort_order) ?? 0) - (Number(b.sort_order) ?? 0));
    return NextResponse.json({ products: list });
  } catch (err) {
    console.error('Get products error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
