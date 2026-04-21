import { Clock3, Flame, HandPlatter, Wallet } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api/api";
import Button from "../../components/common/Button";
import FoodSelection from "../../components/foodSelection/FoodSelection";
import Header from "../../components/common/Header";
import { SubmitPreferencesDto } from "./dto/submit-preferences.dto";
import styles from "./surveyPage.module.scss";

type Food = {
	id: string;
	name: string;
	description: string;
	imgUrl: string;
	reason?: string;
};

export type Preference = "Good" | "Bad" | "Soso";

type MealTime = "breakfast" | "lunch" | "dinner" | "late-night";
type DiningMode = "dine-in" | "delivery";
type FoodCategory =
	| "korean"
	| "chinese"
	| "japanese"
	| "western"
	| "fastfood"
	| "asian"
	| "meat";

type RecommendationRequestDto = {
	diningMode: DiningMode;
	excludedCategories: FoodCategory[];
	limit: number;
	maxBudget: number;
	mealTime: MealTime;
	preferredCategories: FoodCategory[];
	quickMealPreferred: boolean;
	shareablePreferred: boolean;
	spicePreference: number;
};

const CATEGORY_OPTIONS: { label: string; value: FoodCategory }[] = [
	{ label: "Italian", value: "western" },
	{ label: "Mexican", value: "asian" },
	{ label: "Sushi", value: "japanese" },
	{ label: "Korean", value: "korean" },
	{ label: "Chinese", value: "chinese" },
	{ label: "Burger", value: "fastfood" },
	{ label: "BBQ", value: "meat" },
];

const MEAL_TIME_OPTIONS: { label: string; value: MealTime }[] = [
	{ label: "Breakfast", value: "breakfast" },
	{ label: "Lunch", value: "lunch" },
	{ label: "Dinner", value: "dinner" },
];

const DINING_MODE_OPTIONS: {
	description: string;
	label: string;
	value: DiningMode;
}[] = [
	{ label: "Delivery", value: "delivery", description: "빠르게 받아보기" },
	{ label: "Dine-In", value: "dine-in", description: "매장에서 같이 식사" },
];

const BUDGET_OPTIONS = [10000, 15000, 20000, 30000];

const DEFAULT_REQUEST_FORM: RecommendationRequestDto = {
	diningMode: "delivery",
	excludedCategories: [],
	limit: 10,
	maxBudget: 15000,
	mealTime: "lunch",
	preferredCategories: ["korean", "asian"],
	quickMealPreferred: true,
	shareablePreferred: false,
	spicePreference: 1,
};

function SurveyPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const roomId = location.state.roomId;
	const participantId = location.state.participantId;
	const ITEMS_PER_PAGE = 3;
	const [currentPage, setCurrentPage] = useState(1);
	const [foodList, setFoodList] = useState<Food[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFetchingRecommendations, setIsFetchingRecommendations] =
		useState(false);
	const [requestForm, setRequestForm] =
		useState<RecommendationRequestDto>(DEFAULT_REQUEST_FORM);
	const [preferences, setPreferences] = useState<Record<string, Preference>>({});
	const [step, setStep] = useState<"conditions" | "survey">("conditions");
	const totalPages = Math.ceil(foodList.length / ITEMS_PER_PAGE);
	const start = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentFoods = foodList.slice(start, start + ITEMS_PER_PAGE);

	const fetchRecommendedFoods = async () => {
		try {
			setIsFetchingRecommendations(true);
			const response = await api.post("/foods/recommendations", requestForm);
			setFoodList(response.data);
			const initialPrefs: Record<string, Preference> = {};
			response.data.forEach((food: Food) => {
				initialPrefs[food.id] = "Soso";
			});
			setPreferences(initialPrefs);
			setCurrentPage(1);
			setStep("survey");
		} catch (err) {
			console.error("요청 중 오류 발생", err);
		} finally {
			setIsFetchingRecommendations(false);
		}
	};

	const handleSetPreference = (id: string, pref: Preference) => {
		setPreferences((prev) => ({
			...prev,
			[id]: pref,
		}));
	};

	const toggleCategory = (
		field: "preferredCategories" | "excludedCategories",
		category: FoodCategory,
	) => {
		setRequestForm((prev) => {
			const current = prev[field];
			const hasCategory = current.includes(category);
			const nextCategories = hasCategory
				? current.filter((item) => item !== category)
				: [...current, category];

			const otherField =
				field === "preferredCategories"
					? "excludedCategories"
					: "preferredCategories";

			return {
				...prev,
				[field]: nextCategories,
				[otherField]: prev[otherField].filter((item) => item !== category),
			};
		});
	};

	const submitPreferences = async (data: SubmitPreferencesDto) => {
		await api.post("/preferences/submit", data);
	};

	const handleCompleted = async () => {
		await api.patch(`/participants/${participantId}/complete`);
	};

	const handleNext = async () => {
		const data: SubmitPreferencesDto = {
			participantId,
			preferences: foodList.map((food) => ({
				foodId: food.id,
				preference: preferences[food.id],
			})),
		};

		try {
			setIsSubmitting(true);
			await submitPreferences(data);
			await handleCompleted();
			navigate("/progress", {
				state: { id: participantId, roomId },
			});
		} catch (err) {
			console.error("선호도 제출 중 오류 발생:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<section className={styles.topArea}>
				<Header
					text={
						step === "conditions"
							? "Preference Filter"
							: "Taste Assessment"
					}
					description={
						step === "conditions"
							? "식사 시간, 방식, 예산과 먹고 싶은 카테고리를 먼저 정리합니다."
							: "후보를 빠르게 넘기며 좋음 또는 별로예요를 선택하세요."
					}
				/>
				<div className={styles.content}>
					{step === "conditions" ? (
						<div className={styles.formSection}>
							<div className={styles.block}>
								<div className={styles.blockHeader}>
									<Clock3 size={18} />
									<div>
										<div className={styles.blockTitle}>Meal time</div>
										<div className={styles.blockDescription}>
											추천 후보를 좁힐 시간대를 선택하세요.
										</div>
									</div>
								</div>
								<div className={styles.segmentedRow}>
									{MEAL_TIME_OPTIONS.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`${styles.segmentedButton} ${
												requestForm.mealTime === option.value
													? styles.segmentedActive
													: ""
											}`}
											onClick={() =>
												setRequestForm((prev) => ({
													...prev,
													mealTime: option.value,
												}))
											}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							<div className={styles.block}>
								<div className={styles.blockHeader}>
									<HandPlatter size={18} />
									<div>
										<div className={styles.blockTitle}>Dining method</div>
										<div className={styles.blockDescription}>
											배달인지, 함께 외식할지 선택하세요.
										</div>
									</div>
								</div>
								<div className={styles.modeGrid}>
									{DINING_MODE_OPTIONS.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`${styles.modeCard} ${
												requestForm.diningMode === option.value
													? styles.modeActive
													: ""
											}`}
											onClick={() =>
												setRequestForm((prev) => ({
													...prev,
													diningMode: option.value,
												}))
											}
										>
											<div className={styles.modeTitle}>{option.label}</div>
											<div className={styles.modeDescription}>
												{option.description}
											</div>
										</button>
									))}
								</div>
							</div>

							<div className={styles.formGrid}>
								<div className={styles.block}>
									<div className={styles.blockHeader}>
										<Wallet size={18} />
										<div>
											<div className={styles.blockTitle}>Budget</div>
											<div className={styles.blockDescription}>
												1인당 예산 상한을 조정하세요.
											</div>
										</div>
									</div>
									<input
										className={styles.range}
										max={30000}
										min={5000}
										step={1000}
										type="range"
										value={requestForm.maxBudget}
										onChange={(e) =>
											setRequestForm((prev) => ({
												...prev,
												maxBudget: e.target.valueAsNumber || 0,
											}))
										}
									/>
									<div className={styles.priceValue}>
										₩{requestForm.maxBudget.toLocaleString()}
									</div>
									<div className={styles.chipRow}>
										{BUDGET_OPTIONS.map((budget) => (
											<button
												key={budget}
												type="button"
												className={`${styles.chip} ${
													requestForm.maxBudget === budget
														? styles.chipActive
														: ""
												}`}
												onClick={() =>
													setRequestForm((prev) => ({
														...prev,
														maxBudget: budget,
													}))
												}
											>
												₩{budget.toLocaleString()}
											</button>
										))}
									</div>
								</div>

								<div className={styles.block}>
									<div className={styles.blockHeader}>
										<Flame size={18} />
										<div>
											<div className={styles.blockTitle}>Spice preference</div>
											<div className={styles.blockDescription}>
												매운맛 강도를 조절하세요.
											</div>
										</div>
									</div>
									<input
										className={styles.range}
										max={3}
										min={0}
										type="range"
										value={requestForm.spicePreference}
										onChange={(e) =>
											setRequestForm((prev) => ({
												...prev,
												spicePreference: Number(e.target.value),
											}))
										}
									/>
									<div className={styles.priceValue}>
										{["거의 안 매움", "약간 매움", "중간", "매움"][
											requestForm.spicePreference
										]}
									</div>
									<div className={styles.toggleStack}>
										<label className={styles.checkboxRow}>
											<input
												checked={requestForm.quickMealPreferred}
												type="checkbox"
												onChange={(e) =>
													setRequestForm((prev) => ({
														...prev,
														quickMealPreferred: e.target.checked,
													}))
												}
											/>
											빠르게 먹기 좋은 메뉴 선호
										</label>
										<label className={styles.checkboxRow}>
											<input
												checked={requestForm.shareablePreferred}
												type="checkbox"
												onChange={(e) =>
													setRequestForm((prev) => ({
														...prev,
														shareablePreferred: e.target.checked,
													}))
												}
											/>
											함께 나눠먹기 좋은 메뉴 선호
										</label>
									</div>
								</div>
							</div>

							<div className={styles.block}>
								<div className={styles.blockTitle}>Craving chips</div>
								<div className={styles.blockDescription}>
									먹고 싶은 카테고리와 제외할 카테고리를 나눠서 표시하세요.
								</div>
								<div className={styles.categoryColumns}>
									<div className={styles.categorySection}>
										<div className={styles.categoryLabel}>Preferred</div>
										<div className={styles.categoryList}>
											{CATEGORY_OPTIONS.map((category) => (
												<button
													key={`preferred-${category.value}`}
													className={`${styles.categoryChip} ${
														requestForm.preferredCategories.includes(
															category.value,
														)
															? styles.selected
															: ""
													}`}
													type="button"
													onClick={() =>
														toggleCategory(
															"preferredCategories",
															category.value,
														)
													}
												>
													{category.label}
												</button>
											))}
										</div>
									</div>
									<div className={styles.categorySection}>
										<div className={styles.categoryLabel}>Excluded</div>
										<div className={styles.categoryList}>
											{CATEGORY_OPTIONS.map((category) => (
												<button
													key={`excluded-${category.value}`}
													className={`${styles.categoryChip} ${
														requestForm.excludedCategories.includes(
															category.value,
														)
															? styles.excluded
															: ""
													}`}
													type="button"
													onClick={() =>
														toggleCategory(
															"excludedCategories",
															category.value,
														)
													}
												>
													{category.label}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className={styles.foodList}>
							<div className={styles.voteHeader}>
								<div>
									<div className={styles.blockTitle}>Dish voting</div>
									<div className={styles.blockDescription}>
										{currentPage}/{Math.max(totalPages, 1)} 페이지
									</div>
								</div>
								<div className={styles.voteBadge}>
									후보 {foodList.length}개
								</div>
							</div>
							{currentFoods.length > 0 ? (
								currentFoods.map((food) => (
									<FoodSelection
										key={food.id}
										id={food.id}
										name={food.name}
										description={food.description}
										imgUrl={food.imgUrl}
										preference={preferences[food.id] ?? "Soso"}
										reason={food.reason}
										setPreference={(pref) => handleSetPreference(food.id, pref)}
									/>
								))
							) : (
								<div className={styles.emptyState}>
									조건에 맞는 후보가 없습니다. 조건을 조정해 다시 추천을
									받아주세요.
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			<div className={styles.buttonArea}>
				{step === "conditions" ? (
					<>
						<Button
							text="Reset Filters"
							onClick={() => setRequestForm(DEFAULT_REQUEST_FORM)}
							variant="ghost"
						/>
						<Button
							text={
								isFetchingRecommendations
									? "Loading Recommendations..."
									: "Get Recommendations"
							}
							onClick={fetchRecommendedFoods}
							disabled={isFetchingRecommendations}
							variant="primary"
						/>
					</>
				) : (
					<>
						<Button
							text={currentPage === 1 ? "Back to Filters" : "Previous"}
							onClick={() =>
								currentPage === 1
									? setStep("conditions")
									: setCurrentPage((prev) => Math.max(prev - 1, 1))
							}
							disabled={isSubmitting}
							variant="ghost"
						/>
						<Button
							text={
								isSubmitting
									? "Submitting..."
									: currentPage === totalPages
										? "Submit Votes"
										: "Next"
							}
							onClick={
								currentPage === totalPages
									? () => {
											void handleNext();
									  }
									: () => setCurrentPage((prev) => prev + 1)
							}
							disabled={isSubmitting || totalPages === 0}
							variant="primary"
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default SurveyPage;
