import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cdjsxaroyhuusjoktytv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkanN4YXJveWh1dXNqb2t0eXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTgzMzAsImV4cCI6MjEwNzQ5NDMzMH0.NUGAAIqor-bFnU5U6iPudb9ms-ntXj2DxLGph9pGly0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
