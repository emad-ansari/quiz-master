import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { fetchTriviaQuestions, type Question } from "@/lib/quiz-api";
import { saveHighScore, isNewHighScore } from "@/lib/high-scores";
import { useNavigate, useSearchParams } from "react-router-dom";

interface QuizState {
	questions: Question[];
	currentQuestionIndex: number;
	selectedAnswers: (number | null)[];
	timeRemaining: number;
	isQuizComplete: boolean;
}

export default function QuizContainer() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const difficulty = searchParams.get("difficulty") || "medium";

	const [quizState, setQuizState] = useState<QuizState>({
		questions: [],
		currentQuestionIndex: 0,
		selectedAnswers: [],
		timeRemaining: 30,
		isQuizComplete: false,
	});

	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Load questions on component mount
	useEffect(() => {
		loadQuestions();
	}, [difficulty]);

	// Timer effect
	useEffect(() => {
		if (
			quizState.timeRemaining > 0 &&
			!quizState.isQuizComplete &&
			!isLoading
		) {
			const timer = setTimeout(() => {
				setQuizState((prev) => ({
					...prev,
					timeRemaining: prev.timeRemaining - 1,
				}));
			}, 1000);
			return () => clearTimeout(timer);
		} else if (quizState.timeRemaining === 0 && !isLoading) {
			handleTimeUp();
		}
	}, [quizState.timeRemaining, quizState.isQuizComplete, isLoading]);

	const loadQuestions = async () => {
		setIsLoading(true);
		try {
			const questions = await fetchTriviaQuestions(difficulty, 10);
			setQuizState((prev) => ({
				...prev,
				questions,
				selectedAnswers: new Array(questions.length).fill(null),
			}));
		} catch (error) {
			console.error("Failed to load questions:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTimeUp = () => {
		if (!isSubmitting) {
			handleAnswerSubmit();
		}
	};

	const handleAnswerSubmit = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		const newAnswers = [...quizState.selectedAnswers];
		newAnswers[quizState.currentQuestionIndex] = selectedOption;

		setQuizState((prev) => ({
			...prev,
			selectedAnswers: newAnswers,
		}));

		// Move to next question or finish quiz
		if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
			setQuizState((prev) => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex + 1,
				timeRemaining: 30,
			}));
			setSelectedOption(null);
			setIsSubmitting(false);
		} else {
			// Quiz complete - calculate score and save high score
			const finalAnswers = [...newAnswers];
			const score = calculateScore(finalAnswers);

			// Save high score
			saveHighScore(score, quizState.questions.length, difficulty);
			const isNewHigh = isNewHighScore(
				score,
				quizState.questions.length,
				difficulty
			);

			// Store results in localStorage for results page
			localStorage.setItem(
				"quizResults",
				JSON.stringify({
					questions: quizState.questions,
					answers: finalAnswers,
					score: score,
					difficulty: difficulty,
					isNewHighScore: isNewHigh,
				})
			);

			navigate("/results");
		}
	};

	const calculateScore = (answers: (number | null)[]) => {
		return answers.reduce((score, answer, index) => {
			if (answer === quizState.questions[index]?.correctAnswer) {
				return score + 1;
			}
			return score;
		}, 0);
	};

	const handlePreviousQuestion = () => {
		if (quizState.currentQuestionIndex > 0) {
			setQuizState((prev) => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex - 1,
				timeRemaining: 30,
			}));
			setSelectedOption(
				quizState.selectedAnswers[quizState.currentQuestionIndex - 1]
			);
		}
	};

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (isLoading || isSubmitting) return;

			// Number keys 1-4 for option selection
			if (event.key >= "1" && event.key <= "4") {
				const optionIndex = Number.parseInt(event.key) - 1;
				if (optionIndex < currentQuestion?.options.length) {
					setSelectedOption(optionIndex);
				}
			}

			// Enter to submit
			if (event.key === "Enter" && selectedOption !== null) {
				handleAnswerSubmit();
			}

			// Arrow keys for navigation
			if (
				event.key === "ArrowLeft" &&
				quizState.currentQuestionIndex > 0
			) {
				handlePreviousQuestion();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [
		selectedOption,
		quizState.currentQuestionIndex,
		isLoading,
		isSubmitting,
	]);

	const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
	const progress =
		((quizState.currentQuestionIndex + 1) / quizState.questions.length) *
		100;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="animate-fade-in">
					<CardContent className="flex items-center gap-3 p-6">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
						<span className="text-foreground">
							Loading questions from Open Trivia DB...
						</span>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!currentQuestion) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="animate-fade-in">
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-muted-foreground mb-4">
								No questions available
							</p>
							<Button
								onClick={() => navigate('/')}
								className="transition-all duration-200 hover:scale-105"
							>
								Back to Home
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
			{/* Header */}
			<div className="mb-10">
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="outline"
						onClick={() => navigate("/")}
						className="flex items-center gap-2 transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 px-6 py-3"
						aria-label="Go back to home page"
					>
						<ArrowLeft className="h-5 w-5" />
						Back to Home
					</Button>
					<Badge
						variant="secondary"
						className="text-sm font-bold px-4 py-2 bg-primary/10 text-primary border border-primary/20"
					>
						{difficulty.toUpperCase()} MODE
					</Badge>
				</div>

				{/* Progress */}
				<div className="space-y-4">
					<div className="flex justify-between text-base text-muted-foreground font-medium">
						<span>
							Question {quizState.currentQuestionIndex + 1} of{" "}
							{quizState.questions.length}
						</span>
						<span className="text-primary font-semibold">
							{currentQuestion.category}
						</span>
					</div>
					<div className="relative">
						<Progress
							value={progress}
							className="h-3 transition-all duration-500 bg-muted/50"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full"></div>
					</div>
				</div>
			</div>

			<Card
				className={`mb-8 transition-all duration-300 border-2 ${
					quizState.timeRemaining <= 10
						? "border-destructive/50 bg-destructive/5 animate-pulse shadow-lg shadow-destructive/20"
						: "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
				}`}
			>
				<CardContent className="p-6">
					<div className="flex items-center justify-center gap-3">
						<Clock
							className={`h-6 w-6 ${
								quizState.timeRemaining <= 10
									? "text-destructive"
									: "text-primary"
							}`}
						/>
						<span
							className={`text-2xl font-bold ${
								quizState.timeRemaining <= 10
									? "text-destructive"
									: "text-primary"
							}`}
						>
							{quizState.timeRemaining}s
						</span>
						<span className="text-muted-foreground text-sm">
							remaining
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Question */}
			<Card className="mb-10 animate-slide-in shadow-xl border-0 bg-card/80 backdrop-blur-sm">
				<CardContent className="p-10">
					<h2
						className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-balance leading-tight"
						role="heading"
						aria-level={2}
					>
						{currentQuestion.question}
					</h2>

					<div
						className="space-y-4"
						role="radiogroup"
						aria-labelledby="question-heading"
					>
						{currentQuestion.options.map((option, index) => (
							<Button
								key={index}
								variant={
									selectedOption === index
										? "default"
										: "outline"
								}
								className={`w-full text-left justify-start p-6 h-auto transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] text-lg border-2 rounded-2xl ${
									selectedOption === index
										? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
										: "hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
								}`}
								onClick={() => setSelectedOption(index)}
								role="radio"
								aria-checked={selectedOption === index}
								aria-label={`Option ${String.fromCharCode(
									65 + index
								)}: ${option}`}
								tabIndex={0}
							>
								<span
									className="mr-4 font-bold text-xl bg-muted/50 rounded-full w-8 h-8 flex items-center justify-center"
									aria-hidden="true"
								>
									{String.fromCharCode(65 + index)}
								</span>
								<span className="leading-relaxed">
									{option}
								</span>
							</Button>
						))}
					</div>

					<div className="mt-6 text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
						💡 Use keys 1-4 to select options, Enter to submit, or
						click the buttons
					</div>
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex justify-between items-center">
				<Button
					variant="outline"
					onClick={handlePreviousQuestion}
					disabled={quizState.currentQuestionIndex === 0}
					className="flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 bg-card/50 backdrop-blur-sm border-2 px-6 py-3 text-lg"
					aria-label="Go to previous question"
				>
					<ArrowLeft className="h-5 w-5" />
					Previous
				</Button>

				<div className="relative">
					<div className="absolute inset-0 bg-primary/20 rounded-2xl blur-sm scale-110"></div>
					<Button
						onClick={handleAnswerSubmit}
						disabled={selectedOption === null || isSubmitting}
						className="relative flex items-center gap-3 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
						aria-label={
							quizState.currentQuestionIndex ===
							quizState.questions.length - 1
								? "Finish quiz"
								: "Go to next question"
						}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								Processing...
							</>
						) : (
							<>
								{quizState.currentQuestionIndex ===
								quizState.questions.length - 1
									? "Finish Quiz"
									: "Next Question"}
								<ArrowRight className="h-5 w-5" />
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
