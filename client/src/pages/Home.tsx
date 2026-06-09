import { AnimalClassifier } from '@/components/AnimalClassifier';
import { Chat } from '@/components/Chat';
import { Pattern } from '@/components/Pattern';

function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-3">AI Tools</h1>

      <p className="text-zinc-600 mb-6">เครื่องมือ AI ในที่เดียว</p>
      <div className="flex flex-col gap-3">
        <Pattern />
        <AnimalClassifier />
        <Chat />
      </div>
    </>
  );
}

export default Home;
