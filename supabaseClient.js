// supabaseClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mjbzeuusmdhnimykmpwi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qYnpldXVzbWRobmlteWttcHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMzcwNTgsImV4cCI6MjAzODcxMzA1OH0.KpjWThEuPMlSV_XV18TUUAOWyTeDJWfzTm0ogAQ4p5w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});
