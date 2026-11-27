import logo from "@/assets/palmeiras-logo.png";

export function Header() {
  return (
    <header className="flex justify-center bg-primary py-2.5 sm:py-4">
      <img src={logo} alt="Palmeiras" width={64} height={64} className="h-14 w-14 sm:h-16 sm:w-16 object-contain" fetchPriority="high" />
    </header>
  );
}
