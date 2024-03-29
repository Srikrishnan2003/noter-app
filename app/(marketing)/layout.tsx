import { Navbar } from "./_components/navbar";

const MarketingLayour = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-lvh dark:bg-[#1F1F1F]">
            <Navbar />
            <main className="h-full  pt-40">
                {children}
            </main>

        </div>
      );
}
 
export default MarketingLayour;