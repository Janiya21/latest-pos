import NavBarUI from "./navbar/page";
import MainPage from "@/components/basic/MainPage";

export default function Home() {
  
  return (
    <main
      style={{
        backgroundColor: "rgb(243 244 246 / var(--tw-bg-opacity, 1))",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="min-h-screen py-4 px-4 sm:px-6 md:px-12 lg:px-52"
    >
      <div
        className="bg-white px-2 md:px-4 md:py-5 lg:py-5 py-2 border-1 rounded-xl"
        style={{}}
      >
        <div>
          <NavBarUI />
        </div>
        <div className="pb-6">
          <div className="mt-5">
            <MainPage />
          </div>
        </div>
      </div>
    </main>
  );
}
