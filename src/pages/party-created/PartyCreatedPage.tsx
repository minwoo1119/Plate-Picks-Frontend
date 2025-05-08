import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import { Check } from "lucide-react";
import CopyTextForm from "../../components/common/CopyTextForm";
import Header from "../../components/common/Header";
import styles from "./partyCreatedPage.module.scss";
import { useNavigate } from "react-router-dom";

function PartyCreatedPage() {
	const [inviteLink, setInviteLink] = useState<string>("");
	const navigate = useNavigate();
	useEffect(() => {
		setInviteLink("https://example.com/invite/12345");
		// 임시 링크
	});
	return (
		<div className={styles.container}>
			<Header text="모임이 생성되었습니다!" />
			<div className={styles.content}>
				<div className={styles.checkContainer}>
					<Check className={styles.icon} />
					<div className={styles.mainText}>모임이 준비되었습니다.</div>
					<div className={styles.subText}>
						이 링크를 모임 참가자들과 공유하세요.
					</div>
				</div>
				<CopyTextForm text={inviteLink} />
				<div className={styles.infoBox}>
					<div className={styles.infoTitle}>다음 단계는 무엇인가요 ?</div>
					<div className={styles.infos}>
						<div>1. 링크를 모아 참가자들과 공유하세요.</div>
						<div>2. 각 참가자는 간단한 음식 선호도 설문을 완료합니다.</div>
						<div>3. 모든 참가자가 설문을 완료함녀 메뉴 추천이 생성됩니다.</div>
					</div>
				</div>
			</div>

			<Button
				text="내 모임으로 계속하기"
				onClick={() => navigate("/join")}
				color="#5046E5"
				fontColor="white"
			/>
		</div>
	);
}

export default PartyCreatedPage;
