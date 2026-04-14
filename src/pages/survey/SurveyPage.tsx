import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import FoodSelection from '../../components/foodSelection/FoodSelection';
import Header from '../../components/common/Header';
import { SubmitPreferencesDto } from './dto/submit-preferences.dto';
import api from '../../api/api';
import styles from './surveyPage.module.scss';

type Food = {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    reason?: string;
};

export type Preference = 'Good' | 'Bad' | 'Soso';

type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'late-night';
type DiningMode = 'dine-in' | 'delivery';
type FoodCategory =
    | 'korean'
    | 'chinese'
    | 'japanese'
    | 'western'
    | 'fastfood'
    | 'asian'
    | 'meat';

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
    { label: '한식', value: 'korean' },
    { label: '중식', value: 'chinese' },
    { label: '일식', value: 'japanese' },
    { label: '양식', value: 'western' },
    { label: '패스트푸드', value: 'fastfood' },
    { label: '아시안', value: 'asian' },
    { label: '고기류', value: 'meat' },
];

function SurveyPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const roomId = location.state.roomId;
    const ITEMS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [foodList, setFoodList] = useState<Food[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingRecommendations, setIsFetchingRecommendations] =
        useState(false);
    const [requestForm, setRequestForm] = useState<RecommendationRequestDto>({
        diningMode: 'delivery',
        excludedCategories: [],
        limit: 10,
        maxBudget: 15000,
        mealTime: 'lunch',
        preferredCategories: ['korean', 'asian'],
        quickMealPreferred: true,
        shareablePreferred: false,
        spicePreference: 1,
    });
    const [preferences, setPreferences] = useState<Record<string, Preference>>(
        {},
    );
    const [step, setStep] = useState<'conditions' | 'survey'>('conditions');
    const totalPages = Math.ceil(foodList.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentFoods = foodList.slice(start, start + ITEMS_PER_PAGE);
    const participantId = location.state.participantId;

    const fetchRecommendedFoods = async () => {
        try {
            setIsFetchingRecommendations(true);
            const response = await api.post(
                '/foods/recommendations',
                requestForm,
            );
            setFoodList(response.data);
            const initialPrefs: Record<string, Preference> = {};
            response.data.forEach((food: Food) => {
                initialPrefs[food.id] = 'Soso';
            });
            setPreferences(initialPrefs);
            setCurrentPage(1);
            setStep('survey');
            console.log('추천 후보 응답:', response.data);
        } catch (err) {
            console.error('요청 중 오류 발생', err);
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
        field: 'preferredCategories' | 'excludedCategories',
        category: FoodCategory,
    ) => {
        setRequestForm((prev) => {
            const current = prev[field];
            const hasCategory = current.includes(category);
            const nextCategories = hasCategory
                ? current.filter((item) => item !== category)
                : [...current, category];

            const otherField =
                field === 'preferredCategories'
                    ? 'excludedCategories'
                    : 'preferredCategories';

            return {
                ...prev,
                [field]: nextCategories,
                [otherField]: prev[otherField].filter(
                    (item) => item !== category,
                ),
            };
        });
    };

    const submitPreferences = async (data: SubmitPreferencesDto) => {
        const response = await api.post('/preferences/submit', data);
        console.log('성공!', response.data);
    };

    const handleCompleted = async () => {
        const response = await api.patch(`/participants/${participantId}/complete`);
        console.log('응답:', response.data);
    };

    const handleSubmitRecommendations = async () => {
        await fetchRecommendedFoods();
    };

    const handleNext = async () => {
        const selected = foodList.map((food) => ({
            id: food.id,
            name: food.name,
            preference: preferences[food.id],
        }));
        console.log('제출할 데이터:', selected);
        const data: SubmitPreferencesDto = {
            participantId: participantId,
            preferences: selected.map((item) => ({
                foodId: item.id,
                preference: item.preference,
            })),
        };
        try {
            setIsSubmitting(true);
            await submitPreferences(data);
            await handleCompleted();
            navigate('/progress', {
                state: { id: participantId, roomId: roomId },
            });
        } catch (err) {
            console.error('선호도 제출 중 오류 발생:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topArea}>
                <Header
                    text={
                        step === 'conditions'
                            ? '이번 식사 조건부터 빠르게 정리해볼게요.'
                            : '추천 후보만 보고 취향을 골라주세요.'
                    }
                    description={
                        step === 'conditions'
                            ? '식사 상황을 입력하면 그 조건에 맞는 후보만 추려서 보여드립니다.'
                            : '각 후보에 대해 좋음 또는 별로예요를 표시하면 최종 추천으로 이어집니다.'
                    }
                />
                <div className={styles.content}>
                    {step === 'conditions' ? (
                        <div className={styles.formSection}>
                            <div className={styles.formGrid}>
                                <label className={styles.field}>
                                    <span>식사 시간</span>
                                    <select
                                        value={requestForm.mealTime}
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                mealTime: e.target
                                                    .value as MealTime,
                                            }))
                                        }
                                    >
                                        <option value='breakfast'>아침</option>
                                        <option value='lunch'>점심</option>
                                        <option value='dinner'>저녁</option>
                                        <option value='late-night'>
                                            야식
                                        </option>
                                    </select>
                                </label>

                                <label className={styles.field}>
                                    <span>식사 방식</span>
                                    <select
                                        value={requestForm.diningMode}
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                diningMode: e.target
                                                    .value as DiningMode,
                                            }))
                                        }
                                    >
                                        <option value='delivery'>배달</option>
                                        <option value='dine-in'>매장 식사</option>
                                    </select>
                                </label>

                                <label className={styles.field}>
                                    <span>1인 최대 예산</span>
                                    <input
                                        min={0}
                                        step={1000}
                                        type='number'
                                        value={requestForm.maxBudget}
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                maxBudget:
                                                    e.target.valueAsNumber ||
                                                    0,
                                            }))
                                        }
                                    />
                                </label>

                                <label className={styles.field}>
                                    <span>매운맛 선호도</span>
                                    <input
                                        max={3}
                                        min={0}
                                        type='range'
                                        value={requestForm.spicePreference}
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                spicePreference: Number(
                                                    e.target.value,
                                                ),
                                            }))
                                        }
                                    />
                                    <strong className={styles.rangeValue}>
                                        {requestForm.spicePreference}
                                    </strong>
                                </label>
                            </div>

                            <div className={styles.toggleSection}>
                                <label className={styles.checkboxRow}>
                                    <input
                                        checked={
                                            requestForm.quickMealPreferred
                                        }
                                        type='checkbox'
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                quickMealPreferred:
                                                    e.target.checked,
                                            }))
                                        }
                                    />
                                    빠르게 먹기 좋은 메뉴 선호
                                </label>
                                <label className={styles.checkboxRow}>
                                    <input
                                        checked={
                                            requestForm.shareablePreferred
                                        }
                                        type='checkbox'
                                        onChange={(e) =>
                                            setRequestForm((prev) => ({
                                                ...prev,
                                                shareablePreferred:
                                                    e.target.checked,
                                            }))
                                        }
                                    />
                                    함께 나눠먹기 좋은 메뉴 선호
                                </label>
                            </div>

                            <div className={styles.categorySection}>
                                <div className={styles.categoryLabel}>
                                    선호 카테고리
                                </div>
                                <div className={styles.categoryList}>
                                    {CATEGORY_OPTIONS.map((category) => (
                                        <button
                                            key={`preferred-${category.value}`}
                                            className={`${styles.categoryChip} ${
                                                requestForm.preferredCategories.includes(
                                                    category.value,
                                                )
                                                    ? styles.selected
                                                    : ''
                                            }`}
                                            type='button'
                                            onClick={() =>
                                                toggleCategory(
                                                    'preferredCategories',
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
                                <div className={styles.categoryLabel}>
                                    제외 카테고리
                                </div>
                                <div className={styles.categoryList}>
                                    {CATEGORY_OPTIONS.map((category) => (
                                        <button
                                            key={`excluded-${category.value}`}
                                            className={`${styles.categoryChip} ${
                                                requestForm.excludedCategories.includes(
                                                    category.value,
                                                )
                                                    ? styles.excluded
                                                    : ''
                                            }`}
                                            type='button'
                                            onClick={() =>
                                                toggleCategory(
                                                    'excludedCategories',
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
                    ) : (
                        <div className={styles.foodList}>
                            {currentFoods.length > 0 ? (
                                currentFoods.map((food) => (
                                    <FoodSelection
                                        key={food.id}
                                        id={food.id}
                                        name={food.name}
                                        description={food.description}
                                        imgUrl={food.imgUrl}
                                        preference={
                                            preferences[food.id] ?? 'Soso'
                                        }
                                        reason={food.reason}
                                        setPreference={(pref) =>
                                            handleSetPreference(food.id, pref)
                                        }
                                    />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    조건에 맞는 후보가 없습니다. 조건을 조정해
                                    다시 추천을 받아주세요.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.buttonArea}>
                {step === 'conditions' ? (
                    <>
                        <Button
                            text='추천 조건 초기화'
                            onClick={() =>
                                setRequestForm({
                                    diningMode: 'delivery',
                                    excludedCategories: [],
                                    limit: 10,
                                    maxBudget: 15000,
                                    mealTime: 'lunch',
                                    preferredCategories: ['korean', 'asian'],
                                    quickMealPreferred: true,
                                    shareablePreferred: false,
                                    spicePreference: 1,
                                })
                            }
                            variant='ghost'
                        />
                        <Button
                            text={
                                isFetchingRecommendations
                                    ? '후보 불러오는 중...'
                                    : '추천 후보 받기'
                            }
                            onClick={handleSubmitRecommendations}
                            color='#2F6B3D'
                            disabled={isFetchingRecommendations}
                            fontColor='#FFFFFF'
                            variant='primary'
                        />
                    </>
                ) : (
                    <>
                        <Button
                            text={currentPage === 1 ? '조건 다시 설정' : '이전'}
                            onClick={() =>
                                currentPage === 1
                                    ? setStep('conditions')
                                    : setCurrentPage((prev) =>
                                          Math.max(prev - 1, 1),
                                      )
                            }
                            disabled={isSubmitting}
                            variant='ghost'
                        />
                        <Button
                            text={
                                isSubmitting
                                    ? '제출 중...'
                                    : currentPage === totalPages
                                      ? '제출'
                                      : '다음'
                            }
                            onClick={
                                currentPage === totalPages
                                    ? () => {
                                          void handleNext();
                                      }
                                    : () => setCurrentPage((prev) => prev + 1)
                            }
                            color='#2F6B3D'
                            disabled={isSubmitting || totalPages === 0}
                            fontColor='#FFFFFF'
                            variant='primary'
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default SurveyPage;
