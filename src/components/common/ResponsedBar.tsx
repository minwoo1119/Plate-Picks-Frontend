import { Check, Circle } from "lucide-react";

import styles from "./responsedBar.module.scss";

type ResponsedBarProps = {
	isChecked: boolean;
	name: string;
	status: string;
};

const ResponsedBar = ({ isChecked, name, status }: ResponsedBarProps) => {
	return (
		<div className={styles.container}>
			<div className={styles.leftSection}>
				<div>
					{isChecked ? (
						<Check className={styles.checkIcon} />
					) : (
						<Circle className={styles.circleIcon} />
					)}
				</div>
				<div className={styles.name}>{name}</div>
			</div>
			<div>{status}</div>
		</div>
	);
};

export default ResponsedBar;
