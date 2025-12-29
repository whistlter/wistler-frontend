import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button variant="primary">Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(<Button loading>Click me</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
