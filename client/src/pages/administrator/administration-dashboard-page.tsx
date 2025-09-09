import { ShieldCheck } from "lucide-react";

const AdministrationDashboardPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 text-white animate-fade-in">
    <div className="flex flex-col items-center gap-4">
      <ShieldCheck className="w-16 h-16 text-yellow-400 animate-bounce" />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        Administration Dashboard
      </h1>
      <p className="text-lg text-gray-300">Comming soon</p>
    </div>
  </div>
);

export default AdministrationDashboardPage;