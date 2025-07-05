import { useEffect, useState } from 'react';

import Button from '../../components/common/Button';
import FoodSelection from '../../components/foodSelection/FoodSelection';
import Header from '../../components/common/Header';
import styles from './surveyPage.module.scss';
import { useNavigate } from 'react-router-dom';

type Food = {
    id: number;
    name: string;
    description: string;
    imgUrl: string;
};

const dummyFoods: Food[] = [
    {
        id: 1,
        name: '마라탕',
        description: '얼얼한 매운맛이 특징인 중국 사천식 탕 요리',
        imgUrl: 'src/img/food.jpeg',
    },
    {
        id: 2,
        name: '김치찌개',
        description: '한국인의 소울푸드, 김치와 돼지고기를 넣은 찌개',
        imgUrl: 'src/img/food.jpeg',
    },
    {
        id: 3,
        name: '파스타',
        description: '크림, 토마토, 오일 등 다양한 소스의 이탈리아 면 요리',
        imgUrl: 'src/img/food.jpeg',
    },
];

export type Preference = 'Good' | 'Bad' | 'Soso';

function SurveyPage() {
    const navigate = useNavigate();

    const [foodList, setFoodList] = useState<Food[]>([]);
    const [preferences, setPreferences] = useState<Record<number, Preference>>(
        {},
    );

    useEffect(() => {
        setFoodList(dummyFoods);
        const initialPrefs: Record<number, Preference> = {};
        dummyFoods.forEach((food) => {
            initialPrefs[food.id] = 'Soso';
        });
        setPreferences(initialPrefs);
    }, []);

    const handleSetPreference = (id: number, pref: Preference) => {
        setPreferences((prev) => ({
            ...prev,
            [id]: pref,
        }));
    };

    const handleNext = () => {
        const selected = foodList.map((food) => ({
            name: food.name,
            preference: preferences[food.id],
        }));
        console.log('제출할 데이터:', selected);
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
                        {foodList.map((food) => (
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
                <Button text='이전' onClick={() => navigate(-1)} />
                <Button
                    text='다음'
                    onClick={handleNext}
                    color='#5046E5'
                    fontColor='#FFFFFF'
                />
            </div>
        </div>
    );
}

export default SurveyPage;
