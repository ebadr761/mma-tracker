import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatsOverview from './StatsOverview';

vi.mock('lucide-react', () => ({
    Clock: () => null,
    Calendar: () => null,
    Zap: () => null,
    TrendingUp: () => null,
}));

describe('StatsOverview Component', () => {
    it('renders stats correctly', () => {
        const props = {
            totalHours: 120.5,
            totalSessions: 45,
            avgIntensity: 7.5,
            disciplineCount: 5
        };

        render(<StatsOverview {...props} />);

        expect(screen.getByText('120.5h')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
        expect(screen.getByText('7.5/10')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });
});
