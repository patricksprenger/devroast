import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DevRoast",
	description: "Roast my code",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(jetbrainsMono.variable, "font-sans antialiased")}>
				<TRPCProvider>
					<header className="fixed top-0 left-0 right-0 h-14 border-b border-border-primary bg-bg-page/80 backdrop-blur-md z-50 px-10 flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 font-mono group">
							<span className="text-accent-green font-bold text-xl group-hover:translate-x-0.5 transition-transform">
								{">"}
							</span>
							<span className="text-text-primary font-medium text-lg tracking-tight">
								devroast
							</span>
						</Link>
						<nav>
							<Link
								href="/leaderboard"
								className="text-text-secondary hover:text-text-primary font-mono text-[13px] transition-colors"
							>
								leaderboard
							</Link>
						</nav>
					</header>
					<main className="pt-14">{children}</main>
				</TRPCProvider>
			</body>
		</html>
	);
}
