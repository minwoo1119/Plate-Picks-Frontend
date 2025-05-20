import styles from "./resultFoodBox.module.scss";

type ResultFoodBoxProps = {
	imgUrl: string;
	foodName: string;
	foodInfo: string;
};

const ResultFoodBox = ({ imgUrl, foodName, foodInfo }: ResultFoodBoxProps) => {
	return (
		<div className={styles.container}>
			<img src="src/img/food.jpeg" alt="음식사진임" />
			<div className={styles.textBox}>
				<div className={styles.foodName}>{foodName}</div>
				<div className={styles.foodInfo}>{foodInfo}</div>
			</div>
		</div>
	);
};

export default ResultFoodBox;
