import Button from "@/components/shared/Button";
import Link from "next/link";

export default function ErrorPageLayout() {
  return (
    <div className="h-screen w-full bg-gray-800 flex justify-center pt-20">
      <div className="flex flex-col gap-5 w-[500px] max-w-[90%]">
        <h2 className="font-bold text-3xl text-white text-center">Coś poszło nie tak podczas ładowania gry 😔</h2>
        <p className="text-medium text-gray-400">
          Spróbuj odświerzyć przeglądarkę, jeśli to nie pomoże to wyłącz i włącz ją na nowo.
        </p>
        <Link href="/">
          <Button>Wróć do przeglądania gier</Button>
        </Link>
      </div>
    </div>
  );
}
