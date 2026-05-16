export function TrustpilotBadge() {
  return (
    <section className="bg-brand-surface-alt py-6">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
        <span className="text-sm font-medium text-brand-text-secondary">
          Высокий рейтинг от пользователей Trustpilot:
        </span>
        <div className="flex items-center gap-2">
          {/* 5 Trustpilot-style green stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="2" fill="#00B67A" />
                <path
                  d="M12 4l2.35 4.76 5.25.77-3.8 3.7.9 5.24L12 15.87l-4.7 2.6.9-5.24-3.8-3.7 5.25-.77L12 4z"
                  fill="white"
                />
              </svg>
            ))}
          </div>
          <a
            href="https://www.trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-text transition-colors hover:text-[#0D47A1]"
          >
            4.5 | Отлично
          </a>
        </div>
      </div>
    </section>
  );
}
