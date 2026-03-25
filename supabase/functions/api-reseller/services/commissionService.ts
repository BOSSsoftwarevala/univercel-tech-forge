export async function applyCommission(supabaseAdmin: any, user: { userId: string }, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.rpc('apply_reseller_commission', {
    p_actor_user_id: user.userId,
    p_order_id: body.order_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}