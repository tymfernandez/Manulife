// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ckhjmgbdawxdphctcvpb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraGptZ2JkYXd4ZHBoY3RjdnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMzU5NzAsImV4cCI6MjA2OTYxMTk3MH0.fP6fHhGnkDdcfO8yDRMhu0K3ikPTe_jFvM0IThQ5BH4'
export const supabase = createClient(supabaseUrl, supabaseKey)
