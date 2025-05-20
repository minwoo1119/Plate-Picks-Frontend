import styles from "./remainPoint.module.scss";

type RemainPointProps = {
	remainCnt: number;
};

const RemainPoint = ({ remainCnt }: RemainPointProps) => {
	const totalCnt = 2;
	return (
		<div className={styles.container}>
			<div>
				무료 재시도 가능 {remainCnt}/{totalCnt}
			</div>
		</div>
	);
};

export default RemainPoint;
