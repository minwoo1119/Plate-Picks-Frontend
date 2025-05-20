import styles from "./statusBar.module.scss";

type StatueBarProps = {
	totalNumOfUsers: number;
	numOfUsersCompleted: number;
};

const StatueBar = ({
	totalNumOfUsers,
	numOfUsersCompleted,
}: StatueBarProps) => {
	const percentage = Math.round((numOfUsersCompleted / totalNumOfUsers) * 100);
	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<div>
					{totalNumOfUsers} 중 {numOfUsersCompleted}명 완료
				</div>
				<div>{percentage}%</div>
			</div>
			<div className={styles.barWrapper}>
				<div className={styles.barFill} style={{ width: `${percentage}%` }} />
			</div>
		</div>
	);
};

export default StatueBar;
