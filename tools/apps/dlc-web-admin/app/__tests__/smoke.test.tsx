import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText('DLC Web Admin')).toBeInTheDocument();
  });

  it('displays correct version', () => {
    render(<HomePage />);
    expect(screen.getByText(/Version 1.3.0/i)).toBeInTheDocument();
  });

  it('has link to dashboard', () => {
    render(<HomePage />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });
});
