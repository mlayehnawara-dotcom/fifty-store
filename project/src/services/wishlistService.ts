import { isSupabaseConfigured, supabase } from '../lib/supabase';

export async function fetchUserWishlistIds(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.from('wishlist').select('product_id').eq('user_id', userId);
  if (error || !data) {
    return [];
  }

  return data
    .map((item) => Number(item.product_id))
    .filter((id) => Number.isFinite(id));
}

export async function addWishlistItem(userId: string, productId: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.from('wishlist').upsert(
    {
      user_id: userId,
      product_id: productId,
    },
    { onConflict: 'user_id,product_id' },
  );
}

export async function removeWishlistItem(userId: string, productId: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
}
