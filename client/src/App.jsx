import { useEffect, useState } from "react";

// for Supabase client
import {createClient} from "@supabase/supabase-js";

 const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
); 


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">RES Project</h1>
        <p className="text-gray-600">React + Vite + Tailwind CSS</p>
      </div>
    </div>
  )
}

export default App