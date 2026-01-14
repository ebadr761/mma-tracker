import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('lucide-react', () => ({
    Clock: () => null,
    Calendar: () => null,
    Zap: () => null,
    TrendingUp: () => null,
}));
