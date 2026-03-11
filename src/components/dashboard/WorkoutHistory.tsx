import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Calendar, Flame, Trophy, Zap } from 'lucide-react';
import { Workout } from '../../types';
import { DISCIPLINE_COLORS } from '../../constants';

function formatDate(dateStr: string): string {
    const today = new Date();
    const date = new Date(dateStr + 'T00:00:00');
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

interface WorkoutHistoryProps {
    workouts: Workout[];
    onDelete: (id: string) => void;
    onLogClick: () => void;
}

// Build heatmap spanning from the earliest workout to today (min 4 weeks)
// Build heatmap for exactly numWeeks going back from today
function buildHeatmap(workouts: Workout[], numWeeks: number) {
    const minutesByDate = new Map<string, number>();
    for (const w of workouts) {
        minutesByDate.set(w.date, (minutesByDate.get(w.date) || 0) + w.duration);
    }

    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // 0=Mon

    // Start from Monday of (numWeeks - 1) weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek - 7 * (numWeeks - 1));

    const weeks: { date: Date; dateStr: string; minutes: number }[][] = [];
    let currentWeek: { date: Date; dateStr: string; minutes: number }[] = [];
    const cursor = new Date(startDate);

    while (cursor <= today) {
        const ds = toDateStr(cursor);
        currentWeek.push({ date: new Date(cursor), dateStr: ds, minutes: minutesByDate.get(ds) || 0 });
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { weeks, minutesByDate };
}

// Target ~11px square cells like GitHub, gap=2px, day-label col=16px, padding=40px
const TARGET = 11;
const GAP = 2;
const DAY_COL = 16;
const PAD = 40;
function calcWeeks(containerWidth: number): number {
    return Math.max(4, Math.floor((containerWidth - PAD - DAY_COL - GAP) / (TARGET + GAP)));
}

function getHeatColor(minutes: number): string {
    if (minutes === 0) return 'bg-edge-subtle';
    if (minutes < 30) return 'bg-indigo-500/25';
    if (minutes < 60) return 'bg-indigo-500/50';
    if (minutes < 90) return 'bg-indigo-500/75';
    return 'bg-indigo-500';
}

export default function WorkoutHistory({ workouts, onDelete, onLogClick }: WorkoutHistoryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [numWeeks, setNumWeeks] = useState(52);
    const [cellSize, setCellSize] = useState(11);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const measure = () => {
            const w = el.clientWidth;
            const nw = calcWeeks(w);
            setNumWeeks(nw);
            // Compute actual cell width so rows can match for square cells
            const totalGaps = (nw - 1) * GAP;
            const availableForCells = w - PAD - DAY_COL - GAP - totalGaps;
            setCellSize(Math.max(6, Math.floor(availableForCells / nw)));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const { weeks, minutesByDate } = useMemo(() => buildHeatmap(workouts, numWeeks), [workouts, numWeeks]);

    const streaks = useMemo(() => {
        const today = new Date();
        let current = 0;
        let longest = 0;
        let streak = 0;

        // Walk backwards from today
        const check = new Date(today);
        for (let i = 0; i < 365; i++) {
            const ds = toDateStr(check);
            if (minutesByDate.has(ds)) {
                streak++;
                if (i <= current + 1) current = streak; // contiguous from today
            } else {
                if (i === 0) current = 0; // didn't train today
                longest = Math.max(longest, streak);
                streak = 0;
            }
            check.setDate(check.getDate() - 1);
        }
        longest = Math.max(longest, streak);

        // Active days in last 12 weeks
        const activeDays = minutesByDate.size;

        // Sessions this month
        const monthStr = today.toISOString().slice(0, 7);
        const monthSessions = workouts.filter(w => w.date.startsWith(monthStr)).length;

        return { current, longest, activeDays, monthSessions };
    }, [workouts, minutesByDate]);

    // Month labels — one per column, only shown at first week of each month
    const colLabels = useMemo(() => {
        const labels: (string | null)[] = [];
        let lastMonth = -1;
        weeks.forEach((week) => {
            const m = week[0].date.getMonth();
            if (m !== lastMonth) {
                labels.push(week[0].date.toLocaleDateString('en-US', { month: 'short' }));
                lastMonth = m;
            } else {
                labels.push(null);
            }
        });
        return labels;
    }, [weeks]);

    // Group workouts by date for the list
    const grouped = useMemo(() => {
        const groups = new Map<string, Workout[]>();
        for (const w of workouts) {
            const existing = groups.get(w.date) || [];
            existing.push(w);
            groups.set(w.date, existing);
        }
        return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
    }, [workouts]);

    if (workouts.length === 0) {
        return (
            <div className="bg-card border border-edge rounded-lg p-12 backdrop-blur text-center">
                <Calendar className="w-16 h-16 text-ink-faint mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No workouts yet</h3>
                <p className="text-ink-muted mb-6">Start logging your training sessions to see them here</p>
                <button
                    onClick={onLogClick}
                    className="bg-accent hover:bg-accent-hover px-6 py-2 rounded-lg font-semibold transition text-white"
                >
                    Log Your First Workout
                </button>
            </div>
        );
    }

    const todayStr = toDateStr(new Date());

    return (
        <div className="space-y-5">
            {/* Contribution Heatmap */}
            <div ref={containerRef} className="bg-card border border-edge rounded-lg p-5">
                <h3 className="text-sm font-semibold text-ink-muted mb-3">Training Activity</h3>
                <div>
                    {/* Grid: day labels column + one column per week, stretches to fill */}
                    <div
                        className="grid gap-0.5 mx-auto w-fit"
                        style={{
                            gridTemplateColumns: `16px repeat(${weeks.length}, ${cellSize}px)`,
                            gridTemplateRows: `auto repeat(7, ${cellSize}px)`,
                        }}
                    >
                        {/* Top-left empty cell */}
                        <div />
                        {/* Month labels row */}
                        {colLabels.map((label, ci) => (
                            <div key={`ml-${ci}`} className="flex items-end justify-start">
                                {label && <span className="text-[10px] text-ink-faint leading-none">{label}</span>}
                            </div>
                        ))}
                        {/* Day labels + grid cells */}
                        {['M', '', 'W', '', 'F', '', 'S'].map((dayLabel, row) => (
                            <>
                                <div key={`dl-${row}`} className="flex items-center justify-center">
                                    <span className="text-[9px] text-ink-faint">{dayLabel}</span>
                                </div>
                                {weeks.map((week, wi) => {
                                    const day = week[row];
                                    if (!day) return <div key={`e-${wi}-${row}`} />;
                                    return (
                                        <div
                                            key={`${wi}-${row}`}
                                            className={`rounded-sm transition-colors ${getHeatColor(day.minutes)} ${
                                                day.dateStr === todayStr ? 'ring-1 ring-accent' : ''
                                            }`}
                                            style={{ height: cellSize }}
                                            title={`${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${day.minutes} min`}
                                        />
                                    );
                                })}
                            </>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-1.5 mt-2 justify-end">
                        <span className="text-[10px] text-ink-faint">Less</span>
                        <div className="w-3 h-3 rounded-sm bg-edge-subtle" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-500/25" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-500/50" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-500/75" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                        <span className="text-[10px] text-ink-faint">More</span>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-card border border-edge rounded-lg px-4 py-2.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-ink-muted">Streak</span>
                    <span className="font-bold">{streaks.current}d</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-edge rounded-lg px-4 py-2.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-ink-muted">Best</span>
                    <span className="font-bold">{streaks.longest}d</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-edge rounded-lg px-4 py-2.5">
                    <Calendar className="w-4 h-4 text-accent-text" />
                    <span className="text-ink-muted">This month</span>
                    <span className="font-bold">{streaks.monthSessions}</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-edge rounded-lg px-4 py-2.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-ink-muted">Active days</span>
                    <span className="font-bold">{streaks.activeDays}</span>
                </div>
            </div>

            {/* Grouped Workout Cards */}
            {grouped.map(([date, items]) => (
                <div key={date}>
                    <h4 className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">{formatDate(date)}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {items.map(workout => (
                            <div
                                key={workout.id}
                                className="bg-card border border-edge rounded-lg pl-0 overflow-hidden flex hover:border-ink-faint transition group"
                            >
                                {/* Discipline accent bar */}
                                <div
                                    className="w-1 shrink-0 rounded-l-lg"
                                    style={{ backgroundColor: DISCIPLINE_COLORS[workout.discipline] || '#6366f1' }}
                                />
                                <div className="flex-1 p-3 flex items-center justify-between gap-2 min-w-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm truncate">{workout.discipline}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-ink-muted mt-0.5">
                                            <span>{workout.duration}m</span>
                                            <span>{workout.intensity}/10</span>
                                            {workout.notes && <span className="truncate max-w-[120px]">{workout.notes}</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDelete(workout.id)}
                                        className="text-red-400/60 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
