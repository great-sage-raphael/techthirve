import { FloatingNavDemo } from "../components/navbar";
import { BackgroundBoxes } from "../components/Backgroundbox";
import { TimelineCarbon } from "../components/catlog";
import Footer from "../components/footer";
import FloatingChatbot from "../components/Chatbot";


export default function Home() {

  return (
    <>
    <FloatingNavDemo/>
      <main className="flex justify-center items-center ">
      <div className="flex flex-col items-center justify-center h-[40rem] ">
     <BackgroundBoxes/>
     
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
      </div>
      
    </div>
      </main>
      <div>
      <TimelineCarbon/>
      </div>
     
     
      <footer>
    <Footer/>
    </footer>
    <div>
    <FloatingChatbot/>
    </div>
    </>
  );
}
