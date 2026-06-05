export async function fetch_function(
  endpoint: string,
  method: string,
  data?: any,
  baseUrl?: string
) {

  const auth_token = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_PROJECT_ID}-auth-token`)

  const res = await fetch(`${baseUrl || process.env.NEXT_PUBLIC_BASE_URL}/${endpoint}`, {
    method: `${method}`,
    headers: {
      "Content-Type": "application/json",
      "apikey": `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify(data),
  });

  let return_data;

  if (!res.ok) {
    throw new Error("invalid credentials");
  } else {
    return_data = await res.json();
  }

  return return_data;
}