import Form from "./components/Form";
import Header from "./components/Header";

export default function Home() {
  return (
    // <div className="w-screen h-screen flex justify-center items-start">
    <div className="flex w-full max-w-[900px] p-8 flex-col justify-center items-start h-full max-h-[900px] rounded-md space-y-2">
      <Header />
      <Form />
    </div>
    // </div>
  );
}
// flex w-full max-w-[900px] bg-slate-200 p-8 flex-col justify-center items-start h-full max-h-[900px] rounded-md space-y-2
