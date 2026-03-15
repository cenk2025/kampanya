import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: brandAsset } = await supabase
      .from('brand_assets')
      .select('logo_url, primary_color, secondary_color, accent_color, font_family, brand_voice')
      .eq('user_id', user.id)
      .single();

    if (!brandAsset || !brandAsset.logo_url) {
      return NextResponse.json({ error: 'No logo found in Brand Kit' }, { status: 404 });
    }

    return NextResponse.json({ logoUrl: brandAsset.logo_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
