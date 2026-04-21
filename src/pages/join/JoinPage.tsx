import { ArrowRight, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api/api";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import Input from "../../components/common/Input";
import styles from "./joinPage.module.scss";

function JoinPage() {
	const [inviteCode, setInviteCode] = useState("");
	const [name, setName] = useState("");
	const location = useLocation();
	const navigate = useNavigate();
	const roomId = location.state?.roomId ?? "";
	const roomCode = location.state?.roomCode ?? "";

	const handleBtnClick = async () => {
		try {
			const response = roomId
				? await api.post("/participants", {
						name,
						roomId,
				  })
				: await api.post("/participants/join-by-code", {
						name,
						code: inviteCode,
				  });

			navigate("/survey", {
				state: {
					name,
					participantId: response.data.id,
					roomId: response.data.roomId,
				},
			});
		} catch (err) {
			console.error("참가 중 오류 발생", err);
		}
	};

	useEffect(() => {
		if (roomCode) {
			setInviteCode(roomCode);
			return;
		}
		setInviteCode("");
	}, [roomCode]);

	return (
		<div className={styles.container}>
			<section className={styles.content}>
				<Header
					text="Join Existing Group"
					description="이름과 초대 코드를 입력하면 바로 추천 후보 평가를 시작할 수 있습니다."
				/>
				<div className={styles.codeBanner}>
					<Ticket size={18} />
					<span>
						{roomId
							? `현재 연결된 코드: ${roomCode || "확인 중"}`
							: `입장할 코드: ${inviteCode || "입력 필요"}`}
					</span>
				</div>
				{!roomId && (
					<Input
						label="초대 코드"
						onChange={(e) => setInviteCode(e.target.value)}
						placeholder="예: XP9-KL2"
						type="text"
						value={inviteCode}
						hint="공유받은 코드를 입력하면 같은 그룹으로 입장합니다."
					/>
				)}
				<Input
					label="이름"
					onChange={(e) => setName(e.target.value)}
					placeholder="표시될 이름을 입력하세요."
					type="text"
					value={name}
				/>
				<div className={styles.inlineHint}>
					<ArrowRight size={16} />
					응답 완료 후 다른 참가자의 진행 상태를 바로 확인합니다.
				</div>
				<Button
					text="Start Voting"
					onClick={handleBtnClick}
					disabled={
						name.trim().length === 0 ||
						(!roomId && inviteCode.trim().length === 0)
					}
					variant="primary"
				/>
			</section>
		</div>
	);
}

export default JoinPage;
