import { ThumbsDown, ThumbsUp, X } from "lucide-react";

import { Preference } from "../../pages/survey/SurveyPage";
import styles from "./foodSelection.module.scss";

type FoodSelectionProps = {
	id: number;
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
				<img src={imgUrl} alt="음식 이미지" />
			</div>
			<div className={styles.textBox}>
				<div>{name}</div>
				<div>{description}</div>
			</div>
			<div className={styles.preferenceBox}>
				<div
					className={`${styles.preferenceBtn} ${
						preference === "like" ? styles.selected : ""
					} ${styles.underline}`}
					onClick={() => setPreference("like")}
				>
					<ThumbsUp width={15} />
				</div>
				<div
					className={`${styles.preferenceBtn} ${
						preference === "dislike" ? styles.selected : ""
					} ${styles.underline}`}
					onClick={() => setPreference("dislike")}
				>
					<ThumbsDown width={15} />
				</div>
				<div
					className={`${styles.preferenceBtn} ${
						preference === "none" ? styles.selected : ""
					}`}
					onClick={() => setPreference("none")}
				>
					<X width={15} />
				</div>
			</div>
		</div>
	);
}

export default FoodSelection;
