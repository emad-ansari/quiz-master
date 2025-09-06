import { Brain, Clock, Trophy, Users } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const features = [
        {
            icon: Brain,
            title: "Smart Questions",
            description: "Curated questions from various topics",
        },
        {
            icon: Clock,
            title: "Timed Challenges",
            description: "30 seconds per question to keep you sharp",
        },
        {
            icon: Trophy,
            title: "Score Tracking",
            description: "Track your progress and high scores",
        },
        {
            icon: Users,
            title: "Multiple Categories",
            description: "Science, History, Sports, and more",
        },
    ];

export const Features = () => {
	return (
		<section className="bg-muted/30 py-20 animate-slide-in">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h3 className="text-4xl font-bold text-foreground mb-4">
						Why Choose QuizMaster?
					</h3>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Experience the ultimate quiz platform with modern
						features and engaging gameplay
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group border-0 bg-card/50 backdrop-blur-sm"
						>
							<CardHeader className="pb-4">
								<div className="relative mx-auto mb-6">
									<div className="absolute inset-0 bg-primary/10 rounded-full blur-sm scale-110"></div>
									<feature.icon className="relative h-16 w-16 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
								</div>
								<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-muted-foreground leading-relaxed text-base">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};
