/* ========================================
   KOFISHOOP — Supabase Auth Module
   ======================================== */

"use strict";

// =========================================
// 1. SUPABASE CLIENT INIT
// =========================================
const SUPABASE_URL = "https://azxhjiekgkksmxqtsfxt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IOOkz9ttK0uLEUICImbXng_GM28JB6b";

let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof supabase === "undefined") {
    console.warn("Supabase SDK not loaded");
    return null;
  }
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage,
    },
  });
  return supabaseClient;
}

// =========================================
// 2. REGISTER
// =========================================
async function registerMember(email, password, fullName, phone, memberType) {
  const sb = initSupabase();
  if (!sb) throw new Error("Supabase tidak tersedia");

  // Sign up via Supabase Auth
  const { data: authData, error: authError } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Pendaftaran gagal");

  // Insert additional member data into members table
  const { error: insertError } = await sb.from("members").insert([
    {
      id: authData.user.id,
      email: email,
      full_name: fullName,
      phone: phone || null,
      member_type: memberType || "regular",
    },
  ]);

  if (insertError) {
    console.warn("Member insert warning:", insertError.message);
    // Non-critical — auth user already created
  }

  return authData;
}

// =========================================
// 3. LOGIN
// =========================================
async function loginMember(email, password) {
  const sb = initSupabase();
  if (!sb) throw new Error("Supabase tidak tersedia");

  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last_login
  const { error: updateError } = await sb
    .from("members")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  if (updateError) {
    console.warn("Last login update warning:", updateError.message);
  }

  return data;
}

// =========================================
// 4. LOGOUT
// =========================================
async function logoutMember() {
  const sb = initSupabase();
  if (!sb) throw new Error("Supabase tidak tersedia");

  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

// =========================================
// 5. GET CURRENT SESSION
// =========================================
async function getMemberSession() {
  const sb = initSupabase();
  if (!sb) return null;

  const { data, error } = await sb.auth.getSession();
  if (error || !data.session) return null;

  // Fetch member profile from members table
  const { data: memberData, error: memberError } = await sb
    .from("members")
    .select("*")
    .eq("id", data.session.user.id)
    .single();

  if (memberError || !memberData) {
    // Return basic auth data if members table not ready
    return {
      id: data.session.user.id,
      email: data.session.user.email,
      full_name:
        data.session.user.user_metadata?.full_name || data.session.user.email,
    };
  }

  return memberData;
}

// =========================================
// 6. LISTEN TO AUTH STATE CHANGES
// =========================================
function onAuthChange(callback) {
  const sb = initSupabase();
  if (!sb) return null;

  const { data: listener } = sb.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return listener;
}

// =========================================
// 7. CHECK IF USER IS LOGGED IN (sync)
// =========================================
function isLoggedIn() {
  const sessionData = localStorage.getItem(
    "sb-azxhjiekgkksmxqtsfxt-auth-token",
  );
  if (!sessionData) return false;
  try {
    const parsed = JSON.parse(sessionData);
    return !!parsed?.access_token;
  } catch {
    return false;
  }
}
