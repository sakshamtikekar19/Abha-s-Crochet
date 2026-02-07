import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint: GET /api/debug-products
 * Returns raw Supabase response to diagnose why products aren't showing.
 * Remove this file after fixing.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  );

  const supabase = createSupabaseAdminClient();

  const debug: Record<string, unknown> = {
    hasUrl: !!url,
    hasServiceKey,
    supabaseClientCreated: !!supabase,
  };

  if (!supabase) {
    return NextResponse.json(debug);
  }

  // Use select('*') to match whatever columns exist
  const { data, error } = await supabase.from('products').select('*');

  debug.rawData = data;
  debug.rawError = error
    ? { message: error.message, code: error.code, details: error.details }
    : null;
  debug.rowCount = Array.isArray(data) ? data.length : 0;

  return NextResponse.json(debug);
}
