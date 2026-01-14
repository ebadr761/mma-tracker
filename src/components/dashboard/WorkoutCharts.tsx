import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartData {
    name: string;
    hours: number;
    [key: string]: string | number;
}

interface TimelineData {
    date: string;
    sessions: number;
    hours: number;
    [key: string]: string | number;
}

interface WorkoutChartsProps {
    disciplineData: ChartData[];
    last7Days: TimelineData[];
    colors: Record<string, string>;
}

export default function WorkoutCharts({ disciplineData, last7Days, colors }: WorkoutChartsProps) {
    return (
        <>
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-bold mb-4">Hours by Discipline</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={disciplineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-bold mb-4">Last 7 Days Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={last7Days}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                        <Line type="monotone" dataKey="hours" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {disciplineData.length > 0 && (
                <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 backdrop-blur">
                    <h3 className="text-xl font-bold mb-4">Discipline Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={disciplineData}
                                dataKey="hours"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {disciplineData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    );
}
