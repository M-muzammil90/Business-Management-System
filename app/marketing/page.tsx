import Link from "next/link";

export default function MarketingPage() {
	return (
		<main className="min-h-screen bg-slate-950 text-white">
			<section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 lg:px-10">
				<header className="flex items-center justify-between">
					<Link href="/marketing" className="text-lg font-semibold tracking-tight">
						Ledgerly
					</Link>
					<Link
						href="/auth/login"
						className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
					>
						Sign in
					</Link>
				</header>

				<div className="max-w-3xl py-20">
					<p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
						Business management, simplified
					</p>
					<h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
						Run the business. See the whole picture.
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
						Keep customers, products, orders, inventory, and performance in one
						focused workspace built for confident decisions.
					</p>
					<div className="mt-10 flex flex-wrap gap-4">
						<Link
							href="/auth/register"
							className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
						>
							Create your workspace
						</Link>
						<Link
							href="/marketing/pricing"
							className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
						>
							View plans
						</Link>
					</div>
				</div>

				<div className="grid gap-4 border-t border-white/10 py-8 text-sm text-slate-300 sm:grid-cols-3">
					<p>Clear operational visibility</p>
					<p>Connected inventory workflows</p>
					<p>Reports that support action</p>
				</div>
			</section>
		</main>
	);
}
