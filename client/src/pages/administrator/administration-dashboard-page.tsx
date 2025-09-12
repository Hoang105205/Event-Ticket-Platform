import { useEffect, useState } from "react";
import { ShieldCheck, Users, Calendar, Ticket, TrendingUp, BarChart2, PieChart } from "lucide-react";
import { getPlatformStatistics } from "@/lib/api";
import { PlatformStatistics } from "@/domain/domain";
import { useAuth } from "react-oidc-context";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const statCards = [
	{
		key: "totalAttendees",
		label: "Total Attendees",
		icon: <Users className="w-7 h-7 text-blue-200" />,
		color: "from-blue-500 to-blue-300",
	},
	{
		key: "totalEvents",
		label: "Total Events",
		icon: <Calendar className="w-7 h-7 text-purple-200" />,
		color: "from-purple-500 to-purple-300",
	},
	{
		key: "publishedEvents",
		label: "Published Events",
		icon: <Calendar className="w-7 h-7 text-green-200" />,
		color: "from-green-500 to-green-300",
	},
	{
		key: "draftEvents",
		label: "Draft Events",
		icon: <Calendar className="w-7 h-7 text-yellow-200" />,
		color: "from-yellow-500 to-yellow-300",
	},
	{
		key: "totalTicketsSold",
		label: "Tickets Sold",
		icon: <Ticket className="w-7 h-7 text-pink-200" />,
		color: "from-pink-500 to-pink-300",
	},
	{
		key: "totalTicketsRemaining",
		label: "Tickets Remaining",
		icon: <Ticket className="w-7 h-7 text-gray-200" />,
		color: "from-gray-500 to-gray-300",
	},
	{
		key: "newAttendeesThisWeek",
		label: "New Attendees (Week)",
		icon: <TrendingUp className="w-7 h-7 text-cyan-200" />,
		color: "from-cyan-500 to-cyan-300",
	},
	{
		key: "newAttendeesThisMonth",
		label: "New Attendees (Month)",
		icon: <TrendingUp className="w-7 h-7 text-orange-200" />,
		color: "from-orange-500 to-orange-300",
	},
];

const COLORS = ["#34d399", "#fbbf24", "#ec4899", "#9ca3af"];

const AdministrationDashboardPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.access_token) return;
      setLoading(true);
      setError(undefined);
      try {
        const data = await getPlatformStatistics(user.access_token);
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };
    if (!isAuthLoading) fetchStats();
  }, [user?.access_token, isAuthLoading]);

  // Data for recharts
  const eventPieData = stats
    ? [
        { name: "Published", value: stats.publishedEvents },
        { name: "Draft", value: stats.draftEvents },
      ]
    : [];

  const attendeeBarData = stats
    ? [
        {
          name: "Attendees",
          Total: stats.totalAttendees,
          "This Week": stats.newAttendeesThisWeek,
          "This Month": stats.newAttendeesThisMonth,
        },
      ]
    : [];

  const ticketPieData = stats
    ? [
        { name: "Sold", value: stats.totalTicketsSold },
        { name: "Remaining", value: stats.totalTicketsRemaining },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-950 text-white animate-fade-in px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ShieldCheck className="w-14 h-14 text-yellow-400 animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
            Administration Dashboard
          </h1>
        </div>
        {/* Loading/Error */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-2" />
            <span className="text-gray-400">Loading platform statistics...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded-lg">{error}</div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {statCards.map((card) => (
                <Card
                  key={card.key}
                  className={`flex flex-col items-center justify-center gap-2 py-6 bg-gradient-to-br ${card.color} border-0 shadow-lg animate-fade-in-up`}
                >
                  <div>{card.icon}</div>
                  <div className="text-lg font-semibold">{card.label}</div>
                  <div className="text-3xl font-bold text-white drop-shadow">
                    {stats[card.key as keyof PlatformStatistics]}
                  </div>
                </Card>
              ))}
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
              {/* Event Pie */}
              <Card className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="w-5 h-5 text-green-300" />
                  <span className="font-semibold text-lg text-green-200">Events</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <RePieChart>
                    <Pie
                      data={eventPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, value }: any) => `${name}: ${value}`}
                    >
                      {eventPieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ color: "#fff", fontSize: 14 }}
                    />
                    <ReTooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </Card>
              {/* Attendee Bar */}
              <Card className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold text-lg text-blue-200">Attendees</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <ReBarChart data={attendeeBarData}>
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Legend />
                    <ReTooltip />
                    <Bar dataKey="Total" fill="#60a5fa" />
                    <Bar dataKey="This Week" fill="#06b6d4" />
                    <Bar dataKey="This Month" fill="#f59e42" />
                  </ReBarChart>
                </ResponsiveContainer>
              </Card>
              {/* Ticket Pie */}
              <Card className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="w-5 h-5 text-pink-300" />
                  <span className="font-semibold text-lg text-pink-200">Tickets</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <RePieChart>
                    <Pie
                      data={ticketPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, value }: any) => `${name}: ${value}`}
                    >
                      {ticketPieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ color: "#fff", fontSize: 14 }}
                    />
                    <ReTooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        ) : null}
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdministrationDashboardPage;