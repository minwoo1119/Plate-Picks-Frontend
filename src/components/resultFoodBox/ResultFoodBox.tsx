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
                <div className={styles.label}>Today&apos;s pick</div>
                <div className={styles.foodName}>{foodName}</div>
                <div className={styles.foodInfo}>{foodInfo}</div>
            </div>
        </div>
    );
};

export default ResultFoodBox;
