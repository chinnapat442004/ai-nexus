import { Pattern } from './components/Pattern';
import { AnimalClassifier } from './components/AnimalClassifier';
import { Chat } from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <main className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <h1 className="text-4xl font-bold mb-3">AI Tools</h1>

        <p className="text-zinc-600 mb-6">เครื่องมือ AI ในที่เดียว</p>
        <div className="flex flex-col gap-3">
          <Pattern />
          <AnimalClassifier />
          <Chat />
        </div>
      </main>
    </div>
  );
}

export default App;
