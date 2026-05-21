import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

let _client = null;

function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? "";
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_KEY ?? "";
}

export function getSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!_client && url && key) {
    _client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      realtime: {
        transport: WebSocket
      }
    });
  }

  return _client;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}
