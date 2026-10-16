export default function TheseDaysLayout({ children }: { children: React.ReactNode }) {
  return (
    // The product page has its own header, so cancel the portfolio navbar spacing.
    <div data-site="these-days" style={{ marginTop: '-3.5rem' }}>
      {children}
    </div>
  )
}
