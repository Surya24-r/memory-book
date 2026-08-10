import { supabase } from "@/components/lib/supabaseClient";

// Coalesces near-simultaneous getSession() calls into a single shared
// promise. Without this, two requests firing at once (e.g. Orders.jsx
// fetching drafts + orders together) can each independently trigger their
// own token refresh, racing each other — Supabase invalidates the old
// refresh token every time a new one is issued, so the "losing" call can
// end up attaching an already-invalidated token to its request.
let inFlightSession = null;

function getSessionCoalesced() {
  if (!inFlightSession) {
    inFlightSession = supabase.auth.getSession().finally(() => {
      // Release shortly after so later, genuinely separate calls can pick
      // up a freshly-refreshed session, while calls that land within the
      // same tick still share this one result.
      setTimeout(() => {
        inFlightSession = null;
      }, 50);
    });
  }
  return inFlightSession;
}

export async function fetchWithAuth(url, options = {}) {
  const { data } = await getSessionCoalesced();
  const token = data.session?.access_token ?? null;

  const buildHeaders = (t) => ({
    ...(options.headers || {}),
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  });

  let response = await fetch(url, { ...options, headers: buildHeaders(token) });

  if (response.status === 401) {
    // Force exactly one fresh lookup (bypassing the coalescing cache),
    // using getSession() rather than refreshSession() — getSession()
    // already refreshes an expired token internally under Supabase's own
    // lock, without us manually racing a second refresh against it.
    inFlightSession = null;
    const { data: freshData } = await supabase.auth.getSession();
    const freshToken = freshData.session?.access_token ?? null;

    if (freshToken && freshToken !== token) {
      response = await fetch(url, { ...options, headers: buildHeaders(freshToken) });
    }
  }

  return response;
}