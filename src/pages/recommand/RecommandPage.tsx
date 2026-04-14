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
            <div className={styles.heroSection}>
                <Header
                    text='지금 가장 균형 좋은 메뉴입니다.'
                    description='참가자들의 응답을 바탕으로 모두가 수긍하기 쉬운 선택지를 골랐습니다.'
                />
                <RemainPoint remainCnt={remainPoint} />
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
                    color='#2F6B3D'
                    disabled={remainPoint <= 0}
                    fontColor='white'
                    variant='primary'
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
