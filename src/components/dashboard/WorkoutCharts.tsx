import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
}

export default function WorkoutCharts({ disciplineData, last7Days }: WorkoutChartsProps) {
    return (
        <>
            <div className="bg-card border border-edge rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-bold mb-4">Hours by Discipline</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={disciplineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                        <XAxis dataKey="name" stroke="var(--chart-axis)" />
                        <YAxis stroke="var(--chart-axis)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--color-edge)', borderRadius: '8px', color: 'var(--color-ink)' }} />
                        <Bar dataKey="hours" fill="var(--chart-bar)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-card border border-edge rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-bold mb-4">Last 7 Days Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={last7Days}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                        <XAxis dataKey="date" stroke="var(--chart-axis)" />
                        <YAxis stroke="var(--chart-axis)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--color-edge)', borderRadius: '8px', color: 'var(--color-ink)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                        <Line type="monotone" dataKey="hours" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
