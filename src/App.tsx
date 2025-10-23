import FlowBuilder from './pages/FlowBuilder';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <FlowBuilder />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
