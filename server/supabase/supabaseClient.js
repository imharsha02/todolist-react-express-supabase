require("dotenv").config({ path: "../../.env.local" });
const { createClient } = require("@supabase/supabase-js");

const public_url = "https://apcarfkkscqxllnrbezh.supabase.co";
const anon_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2FyZmtrc2NxeGxsbnJiZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyODk3MjMsImV4cCI6MjAxMDg2NTcyM30.m2RTyxn0quAZxso-eFxSY7hXVgZ2kZoN6WZ90ZL1cQ0";

supabase = createClient(public_url, anon_key);
module.exports = { supabase };
