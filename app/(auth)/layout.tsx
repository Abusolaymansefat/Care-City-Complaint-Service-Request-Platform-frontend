export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-card-foreground shadow-sm">
        {children}
      </div>
    </main>
  );
}