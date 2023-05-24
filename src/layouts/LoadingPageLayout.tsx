import { TailSpin } from "react-loader-spinner";

export default function LoadingPageLayout() {
  return (
    <div className="h-screen w-full bg-gray-800 flex justify-center pt-20">
      <div className="flex gap-5">
        <h2 className="font-bold text-3xl text-white">Ładowanie gry </h2>
        <TailSpin color="white" height={40} width={40} />
      </div>
    </div>
  );
}
