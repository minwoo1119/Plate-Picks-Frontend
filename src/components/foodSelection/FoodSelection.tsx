import { Heart, Tag, ThumbsDown } from 'lucide-react';

import { Preference } from '../../pages/survey/SurveyPage';
import styles from './foodSelection.module.scss';

type FoodSelectionProps = {
    id: string;
    name: string;
    description: string;
    imgUrl: string;
    preference: Preference;
    reason?: string;
    setPreference: (pref: Preference) => void;
};

function FoodSelection({
    preference,
    setPreference,
    imgUrl,
    name,
    description,
    reason,
}: FoodSelectionProps) {
    return (
        <div className={styles.container}>
            <div className={styles.imgBox}>
                <img src={imgUrl} alt='음식 이미지' />
            </div>
            <div className={styles.textBox}>
                <div className={styles.metaRow}>
                    <span className={styles.tag}>
                        <Tag size={14} />
                        추천 후보
                    </span>
                    {reason && <span className={styles.reason}>{reason}</span>}
                </div>
                <div className={styles.name}>{name}</div>
                <div className={styles.description}>{description}</div>
            </div>
            <div className={styles.preferenceBox}>
                <button
                    className={`${styles.preferenceBtn} ${
                        preference === 'Good' ? styles.selected : ''
                    }`}
                    onClick={() => setPreference('Good')}
                    type='button'
                >
                    <Heart width={15} />
                    <span>Looks good</span>
                </button>
                <button
                    className={`${styles.preferenceBtn} ${
                        preference === 'Bad' ? styles.selected : ''
                    }`}
                    onClick={() => setPreference('Bad')}
                    type='button'
                >
                    <ThumbsDown width={15} />
                    <span>No thanks</span>
                </button>
            </div>
        </div>
    );
}

export default FoodSelection;
