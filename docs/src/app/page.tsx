import Image from "next/image";
import logo from "./logo.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full h-full max-w-5xl flex flex-col items-center justify-center font-mono text-sm">

        <Image src={logo} alt="" width={128} />
        <h1 className="text-2xl font-bold font-mono text-center mb-8">
          Lens is a better way to prove trust.
        </h1>
        <div className="flex justify-center items-center">
          <Link href={"https://forms.gle/XCwJU4YBMJgELnnB7"}>
            <button className="font-bold py-3 px-6 m-2 rounded-xl border border-[#404040] text-[#a3a3a3]">
              Demo
            </button>
          </Link>
          <Link href={"https://projectlens.xyz/paper.pdf"}>
            <button className="font-bold py-3 px-6 m-2 rounded-xl border border-[#5371FF] text-[#a3a3a3]">
              White Paper
            </button>
          </Link>
          <Link href={"https://projectlens.xyz/deck.pdf"}>
            <button className="font-bold py-3 px-6 m-2 rounded-xl border border-[#5371FF] text-[#a3a3a3]">
              Deck
            </button>
          </Link>
          <Link href={"mailto:hi@projectlens.xyz"}>
            <button className="font-bold py-3 px-6 m-2 rounded-xl border border-[#404040] text-[#a3a3a3]">
              Contact
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
