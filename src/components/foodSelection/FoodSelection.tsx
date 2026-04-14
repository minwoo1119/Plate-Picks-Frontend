import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { Preference } from '../../pages/survey/SurveyPage';
import styles from './foodSelection.module.scss';

type FoodSelectionProps = {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    preference: Preference;
    setPreference: (pref: Preference) => void;
};

function FoodSelection({
    preference,
    setPreference,
    imgUrl,
    name,
    description,
}: FoodSelectionProps) {
    return (
        <div className={styles.container}>
            <div className={styles.imgBox}>
                <img src={imgUrl} alt='음식 이미지' />
            </div>
            <div className={styles.textBox}>
                <div className={styles.name}>{name}</div>
                <div className={styles.description}>{description}</div>
            </div>
            <div className={styles.preferenceBox}>
                <div
                    className={`${styles.preferenceBtn} ${
                        preference === 'Good' ? styles.selected : ''
                    }`}
                    onClick={() => setPreference('Good')}
                >
                    <ThumbsUp width={15} />
                    <span>좋아요</span>
                </div>
                <div
                    className={`${styles.preferenceBtn} ${
                        preference === 'Bad' ? styles.selected : ''
                    }`}
                    onClick={() => setPreference('Bad')}
                >
                    <ThumbsDown width={15} />
                    <span>별로예요</span>
                </div>
            </div>
        </div>
    );
}

export default FoodSelection;
