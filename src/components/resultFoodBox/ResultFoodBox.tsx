import styles from './resultFoodBox.module.scss';

type ResultFoodBoxProps = {
    imgUrl: string;
    foodName: string;
    foodInfo: string;
};

const ResultFoodBox = ({ imgUrl, foodName, foodInfo }: ResultFoodBoxProps) => {
    return (
        <div className={styles.container}>
            <img src={imgUrl || 'src/img/food.jpeg'} alt={foodName || '추천 음식'} />
            <div className={styles.textBox}>
                <div className={styles.topRow}>
                    <div className={styles.label}>The Perfect Match</div>
                    <div className={styles.badge}>98% Match</div>
                </div>
                <div className={styles.foodName}>{foodName}</div>
                <div className={styles.foodInfo}>{foodInfo}</div>
                <div className={styles.profileTitle}>Flavor profile</div>
                <div className={styles.profileList}>
                    <span>균형감 있는 선택</span>
                    <span>공유하기 좋은 메뉴</span>
                    <span>그룹 선호 반영</span>
                </div>
            </div>
        </div>
    );
};

export default ResultFoodBox;
