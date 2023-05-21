import Link from "next/link";
import GithubLogo from "../../public/github-logo.svg";
import Image from "next/image";
import { Button } from "./wieksza-populacja/components";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gray-800 relative">
      <header className="flex justify-center pt-8 px-2">
        <h1 className="max-w-4xl text-5xl font-bold text-white sm:text-7xl text-center">WIEDZA O ŚWIECIE</h1>
      </header>
      <main className="w-[90%] max-w-5xl mt-20 pb-20 mx-auto">
        <h3 className="font-medium text-xl text-white">Wszystkie gry</h3>
        <hr className="mt-2 mb-6 bg-gray-500 h-[1px] border-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <GameCard
            name="Większa populacja"
            desciption="Z dwóch kraji odgadnij, który ma większą populacje ludności"
            href="/wieksza-populacja"
          />
        </div>
      </main>
      <footer className="absolute bottom-0 left-0 border-t border-gray-600 flex justify-end w-full p-2">
        <Link href="/" className="bg-white rounded-full border border-white">
          <Image src={GithubLogo.src} height={35} width={35} alt="Github logo" />
        </Link>
      </footer>
    </div>
  );
}

type GameCardProps = { name: string; desciption: string; href: string };
function GameCard(props: GameCardProps) {
  return (
    <div className="p-4 border border-gray-500 rounded-lg flex flex-col justify-between items-center h-[300px] w-full">
      <div className="flex flex-col gap-4 max-w-[300px]">
        <h3 className="text-3xl font-bold text-center text-white">{props.name}</h3>
        <p className="text-gray-500 font-medium text-center">{props.desciption}</p>
      </div>
      <Link href={props.href} className="w-full">
        <Button>ZAGRAJ</Button>
      </Link>
    </div>
  );
}
