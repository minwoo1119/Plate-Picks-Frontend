import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import FoodSelection from '../../components/foodSelection/FoodSelection';
import Header from '../../components/common/Header';
import { SubmitPreferencesDto } from './dto/submit-preferences.dto';
import axios from 'axios';
import styles from './surveyPage.module.scss';

type Food = {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
};

export type Preference = 'Good' | 'Bad' | 'Soso';

function SurveyPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [foodList, setFoodList] = useState<Food[]>([]);
    const [preferences, setPreferences] = useState<Record<string, Preference>>(
        {},
    );
    const totalPages = Math.ceil(foodList.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentFoods = foodList.slice(start, start + ITEMS_PER_PAGE);
    const participantId = location.state.participantId;

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(
                'http://119.56.230.161:7777/foods',
            );
            setFoodList(response.data);
            console.log('fetched data : ', response.data);
        } catch (err) {
            console.error('요청 중 오류 발생', err);
        }
    };

    useEffect(() => {
        fetchFoodList();
        setFoodList(foodList);
        const initialPrefs: Record<string, Preference> = {};
        foodList.forEach((food) => {
            initialPrefs[food.id] = 'Soso';
        });
        setPreferences(initialPrefs);
    }, []);

    const handleSetPreference = (id: string, pref: Preference) => {
        setPreferences((prev) => ({
            ...prev,
            [id]: pref,
        }));
    };

    const submitPreferences = async (data: SubmitPreferencesDto) => {
        try {
            const response = await axios.post(
                'http://119.56.230.161:7777/preferences/submit',
                data,
            );
            console.log('성공!', response.data);
        } catch (err) {
            console.error('에러 발생', err);
        }
    };

    const handleCompleted = async () => {
        try {
            const response = await axios.get(
                `http://119.56.230.161:7777/participants/complete/${participantId}`,
            );
            console.log('응답:', response.data);
        } catch (err) {
            console.error('요청 중 오류 발생:', err);
        }
    };

    const handleNext = () => {
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
        submitPreferences(data);
        handleCompleted();
        navigate('/progress', { state: selected });
    };

    return (
        <div className={styles.container}>
            <div className={styles.topArea}>
                <Header text='음식 선호도' />
                <div className={styles.content}>
                    <div className={styles.textArea}>
                        <div className={styles.titleText}>
                            무엇을 좋아하시나요 ?
                        </div>
                        <div className={styles.subText}>
                            당신의 음식 선호도를 알려주세요.
                        </div>
                    </div>
                    <div className={styles.foodList}>
                        {currentFoods.map((food) => (
                            <FoodSelection
                                key={food.id}
                                id={food.id}
                                name={food.name}
                                description={food.description}
                                imgUrl={food.imgUrl}
                                preference={preferences[food.id] ?? 'Soso'}
                                setPreference={(pref) =>
                                    handleSetPreference(food.id, pref)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.buttonArea}>
                <Button
                    text='이전'
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                />
                <Button
                    text={currentPage === totalPages ? '제출' : '다음'}
                    onClick={
                        currentPage === totalPages
                            ? handleNext
                            : () => setCurrentPage((prev) => prev + 1)
                    }
                    color='#5046E5'
                    fontColor='#FFFFFF'
                />
            </div>
        </div>
    );
}

export default SurveyPage;
