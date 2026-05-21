// src/App.tsx

import { Pattern } from "./components/Pattern"

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-3">
          AI Tools
        </h1>

        <p className="text-zinc-600 mb-3">
          เครื่องมือ AI ในที่เดียว
        </p>

   
               <Pattern />
      
      </main>
    </div>
  )
}

export default App