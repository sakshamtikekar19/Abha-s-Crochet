import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

const CATEGORIES = ['bags', 'flowers', 'clothing', 'baby', 'home'];

function requireAdmin(request: NextRequest): boolean {
  return getSessionFromRequest(request.headers.get('cookie'));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, category, description, image, price_paise, in_stock, sort_order } = body;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = String(name).trim();
    if (category !== undefined) {
      if (!CATEGORIES.includes(category)) {
        return NextResponse.json({ error: `Category must be one of: ${CATEGORIES.join(', ')}` }, { status: 400 });
      }
      updates.category = category;
    }
    if (description !== undefined) updates.description = String(description).trim();
    if (image !== undefined) updates.image = String(image).trim();
    if (price_paise !== undefined) {
      const price = parseInt(String(price_paise), 10);
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
      }
      updates.price_paise = price;
    }
    if (in_stock !== undefined) updates.in_stock = in_stock !== false;
    if (sort_order !== undefined) updates.sort_order = parseInt(String(sort_order), 10) || 0;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
