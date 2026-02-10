 
import { Dock, Navbar,Welcome } from "#components";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";
import { Resume, Safari, Terminal } from "#windows";

gsap.registerPlugin(Draggable);

function App() {

  return (
   
      <main>
          <Navbar />
          <Welcome />
          <Dock />
          <Terminal />
          <Safari />
          <Resume />
      </main>
    
  )
}

export default App
