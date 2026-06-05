import supabase from "@/lib/supabase/supabaseClient";

export async function getOrCreateParent(parentData: {
  name: string;
  phone: string;
  email: string;
  address: string;
}) {
  const { data: existingParent } = await supabase
    .from("parents")
    .select("id")
    .eq("email", parentData.email)
    .maybeSingle();

  if (existingParent) {
    return existingParent.id;
  }

  const { data: newParent, error } = await supabase
    .from("parents")
    .insert([
      {
        name: parentData.name,
        phone_number: parentData.phone,
        email: parentData.email,
        parent_address: parentData.address,
      },
    ])
    .select("id")
    .single();

  if (error) throw error;

  return newParent.id;
}