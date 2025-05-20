import Header from "../../components/common/Header";
import ResponsedBar from "../../components/common/ResponsedBar";
import StatueBar from "../../components/common/StatusBar";
import { Users } from "lucide-react";
import styles from "./progressPage.module.scss";

function ProgressPage() {
	return (
		<div className={styles.container}>
			<Header text="모임 진행 상황" />
			<div className={styles.statusBox}>
				<Users className={styles.icon} />
				<div className={styles.titleText}>응답 대기 중</div>
				<div className={styles.subText}>
					다른 참가자들이 설문을 완료할 때까지 기다려주세요.
				</div>
			</div>
			<StatueBar numOfUsersCompleted={1} totalNumOfUsers={3} />
			<div className={styles.statusContainer}>
				<ResponsedBar isChecked={true} name="홍길동" status="완료됨" />
				<ResponsedBar isChecked={false} name="박철수" status="대기 중" />
				<ResponsedBar isChecked={false} name="이민우" status="대기 중" />
			</div>
		</div>
	);
}

export default ProgressPage;
