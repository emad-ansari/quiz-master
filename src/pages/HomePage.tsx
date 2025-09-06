import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { difficulties, type Difficulty} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Features } from "@/components/common/Features";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/common/Header";


export default function HomePage() {
	const navigate = useNavigate();

	const [selectedDifficulty, setSelectedDifficulty] =
		useState<Difficulty>("medium");

  const onStartQuiz = () => {
    navigate(`/quiz?difficulty=${selectedDifficulty}`)
  }

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<section className="container mx-auto px-4 py-20 animate-fade-in">
				<div className="text-center max-w-4xl mx-auto">
					<div className="mb-8">
						<h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
							Test Your
							<span className="block text-primary">
								Knowledge
							</span>
						</h2>
						<p className="text-xl md:text-2xl text-muted-foreground mb-4 text-pretty max-w-2xl mx-auto leading-relaxed">
							Challenge yourself with our comprehensive quiz
							platform
						</p>
						<p className="text-lg text-muted-foreground/80 text-pretty">
							Choose your difficulty level and dive into questions
							across multiple categories
						</p>
					</div>

					<div className="mb-12">
						<h3 className="text-2xl font-semibold text-foreground mb-8">
							Choose Your Challenge Level
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
							{difficulties.map((difficulty) => (
								<Card
									key={difficulty.level}
									className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 group ${
										selectedDifficulty === difficulty.level
											? "ring-2 ring-primary ring-offset-4 ring-offset-background shadow-2xl scale-105 -translate-y-1"
											: "hover:shadow-xl"
									}`}
									onClick={() =>
										setSelectedDifficulty(difficulty.level)
									}
									role="button"
									tabIndex={0}
									aria-label={`Select ${difficulty.label} difficulty`}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											setSelectedDifficulty(
												difficulty.level
											);
										}
									}}
								>
									<CardHeader className="pb-3">
										<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
											{difficulty.label}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-muted-foreground leading-relaxed">
											{difficulty.description}
										</p>
										<Badge
											className={`${difficulty.color} font-medium px-3 py-1`}
										>
											{difficulty.level.toUpperCase()}
										</Badge>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110"></div>
						<Button
							size="lg"
							className="relative text-xl px-12 py-8 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110 hover:shadow-2xl font-semibold rounded-2xl"
							onClick={onStartQuiz}
							aria-label={`Start quiz with ${selectedDifficulty} difficulty`}
						>
							Start Quiz
						</Button>
					</div>
				</div>
			</section>
			<Features />
		</div>
	);
}
