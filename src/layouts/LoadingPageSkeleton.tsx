import { ThreeDots } from "react-loader-spinner";

export default function LoadingPageLayout() {
  return (
    <div className="h-screen w-full bg-gray-700 flex justify-center pt-20 px-5">
      <ThreeDots color="white" />
    </div>
  );
}
