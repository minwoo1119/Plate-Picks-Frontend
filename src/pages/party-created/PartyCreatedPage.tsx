import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import CopyTextForm from "../../components/common/CopyTextForm";
import Header from "../../components/common/Header";
import styles from "./partyCreatedPage.module.scss";

function PartyCreatedPage() {
	const [inviteCode, setInviteCode] = useState<string>("");
	const navigate = useNavigate();
	const location = useLocation();
	const roomId = location.state?.roomId ?? "";
	const roomCode = location.state?.roomCode ?? "";

	useEffect(() => {
		setInviteCode(roomCode);
	}, [roomCode]);

	const handleShare = async () => {
		const message = `Plate Picks 초대 코드: ${inviteCode}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: "Plate Picks Invite",
					text: message,
				});
				return;
			} catch (err) {
				console.error("공유 실패", err);
			}
		}

		try {
			await navigator.clipboard.writeText(message);
			window.alert("초대 문구를 복사했습니다.");
		} catch (err) {
			console.error("공유 문구 복사 실패", err);
		}
	};

	return (
		<div className={styles.container}>
			<section className={styles.content}>
				<Header
					align="center"
					text="Group Created!"
					description="초대 코드를 공유하면 참가자들이 바로 입장해서 후보 평가를 시작할 수 있습니다."
				/>
				<div className={styles.heroCard}>
					<div className={styles.iconWrap}>
						<Check className={styles.icon} />
					</div>
					<div className={styles.mainText}>모임 준비가 끝났습니다.</div>
					<div className={styles.subText}>
						코드 또는 공유 링크를 보내면 참가자들이 같은 방으로 바로
						들어옵니다.
					</div>
				</div>
				<CopyTextForm text={inviteCode} />
				<div className={styles.infoGrid}>
					<div className={styles.infoCard}>
						<Link2 size={18} />
						<div>
							<div className={styles.infoTitle}>참여 방식</div>
							<div className={styles.infoBody}>
								코드 입력만으로 바로 입장할 수 있습니다.
							</div>
						</div>
					</div>
					<div className={styles.infoCard}>
						<Share2 size={18} />
						<div>
							<div className={styles.infoTitle}>다음 단계</div>
							<div className={styles.infoBody}>
								모든 참가자가 응답을 완료하면 결과 화면으로 이동합니다.
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className={styles.buttonArea}>
				<Button text="Share Invite Link" onClick={handleShare} variant="primary" />
				<Button
					text="Continue to Room"
					onClick={() =>
						navigate("/join", {
							state: { roomId, roomCode: inviteCode },
						})
					}
					variant="secondary"
				/>
			</div>
		</div>
	);
}

export default PartyCreatedPage;
