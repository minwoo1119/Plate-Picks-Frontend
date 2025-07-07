import { useEffect, useState } from 'react';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import RemainPoint from '../../components/common/RemainPoint';
import ResultFoodBox from '../../components/resultFoodBox/ResultFoodBox';
import api from '../../api/api';
import styles from './recommandPage.module.scss';
import { useLocation } from 'react-router-dom';

export interface Recommandation {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
}

function RecommandPage() {
    const location = useLocation();
    const [remainPoint, setRemainPoint] = useState(0);
    const roomId = location.state.roomId;
    const [recommandMenu, setRecommandMenu] = useState<Recommandation>();

    const getRecommandMenu = async () => {
        try {
            const response = await api.get(`/preferences/result/${roomId}`);
            setRecommandMenu(response.data);
        } catch (err) {
            console.error('에러 발생!', err);
        }
    };

    const handleRetry = () => {
        getRecommandMenu();
        setRemainPoint(() => remainPoint - 1);
    };

    useEffect(() => {
        setRemainPoint(2);
        getRecommandMenu();
    }, []);
    return (
        <div className={styles.container}>
            <Header text='메뉴 추천' />
            <RemainPoint remainCnt={remainPoint} />
            <div className={styles.textArea}>
                <div className={styles.title}>추천 메뉴</div>
                <div className={styles.subTitle}>
                    여러분의 의견에 맞는 음식입니다 !
                </div>
            </div>
            <div className={styles.recommendBox}>
                <ResultFoodBox
                    imgUrl={recommandMenu?.imgUrl ?? ''}
                    foodName={recommandMenu?.name ?? ''}
                    foodInfo={recommandMenu?.description ?? ''}
                />
            </div>
            <div className={styles.buttonArea}>
                <Button
                    onClick={() => handleRetry()}
                    text='다시 추천받기'
                    color='#5046E5'
                    disabled={remainPoint <= 0}
                    fontColor='white'
                />
                <Button
                    onClick={() => handleRetry()}
                    text='광고 보고 포인트 충전하기'
                />
            </div>
        </div>
    );
}

export default RecommandPage;
