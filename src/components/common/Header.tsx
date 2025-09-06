import { Brain } from "lucide-react";

export const Header = () => {
	return (
		<header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
							<Brain className="relative h-10 w-10 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-foreground tracking-tight">
								QuizMaster
							</h1>
							<p className="text-xs text-muted-foreground">
								Test Your Knowledge
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
