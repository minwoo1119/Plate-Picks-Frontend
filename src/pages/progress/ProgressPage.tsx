import { BellRing, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../api/api";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import ResponsedBar from "../../components/common/ResponsedBar";
import StatueBar from "../../components/common/StatusBar";
import styles from "./progressPage.module.scss";

export interface RoomUserInfo {
	completed: boolean;
	id: string;
	joined_at: Date;
	name: string;
}

export interface RoomInfo {
	total_participants: number;
	joined_participants: number;
	completed_participants: number;
	all_completed: boolean;
}

type ParticipantEventPayload = {
	participantId: string;
	participantName: string;
	participants: RoomUserInfo[];
	type: "participant-joined" | "participant-completed";
};

function ProgressPage() {
	const location = useLocation();
	const roomId = location.state.roomId;
	const [userList, setUserList] = useState<RoomUserInfo[]>([]);
	const navigate = useNavigate();
	const [roomInfo, setRoomInfo] = useState<RoomInfo>();

	useEffect(() => {
		const initializeRoom = async () => {
			try {
				const [participantsResponse, roomResponse] = await Promise.all([
					api.get(`/room/participants/${roomId}`),
					api.get(`/room/${roomId}/status`),
				]);

				setUserList(participantsResponse.data);
				setRoomInfo(roomResponse.data);
			} catch (err) {
				console.error("에러 발생", err);
			}
		};

		void initializeRoom();

		const eventSource = new EventSource(
			`https://api.platepicks.pics/sse/${roomId}`,
		);

		eventSource.onmessage = (event) => {
			const data: ParticipantEventPayload = JSON.parse(event.data);

			if (
				data.type === "participant-joined" ||
				data.type === "participant-completed"
			) {
				setUserList(data.participants);
			}
		};

		eventSource.onerror = (err) => {
			console.error("SSE 오류:", err);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, [roomId]);

	useEffect(() => {
		const completed = userList.filter((u) => u.completed).length;
		const total = roomInfo?.total_participants ?? 0;

		if (completed === total && total > 0) {
			navigate("/recommand", { state: { roomId } });
		}
	}, [navigate, roomId, roomInfo?.total_participants, userList]);

	const handleNotify = async () => {
		const pendingUsers = userList.filter((user) => !user.completed);
		const reminder = pendingUsers.length
			? `Plate Picks 응답 부탁해요: ${pendingUsers
					.map((user) => user.name)
					.join(", ")}`
			: "모든 참가자가 응답을 완료했습니다.";

		try {
			await navigator.clipboard.writeText(reminder);
			window.alert("리마인드 문구를 복사했습니다.");
		} catch (err) {
			console.error("리마인드 복사 실패", err);
		}
	};

	const completedCount = userList.filter((ele) => ele.completed).length;
	const pendingCount = Math.max((roomInfo?.total_participants ?? 0) - completedCount, 0);

	return (
		<div className={styles.container}>
			<section className={styles.heroPanel}>
				<Header
					text="Voting Status"
					description="참가자가 응답을 완료할 때마다 목록과 진행률이 실시간으로 갱신됩니다."
				/>
				<div className={styles.statusBox}>
					<div className={styles.iconWrap}>
						<Users className={styles.icon} />
					</div>
					<div className={styles.statusContent}>
						<div className={styles.titleText}>{completedCount}명이 응답을 완료했어요</div>
						<div className={styles.subText}>
							남은 참가자 {pendingCount}명이 투표를 마치면 자동으로 최종
							추천 화면으로 이동합니다.
						</div>
					</div>
					<Button
						text="Notify"
						onClick={handleNotify}
						variant="secondary"
						size="md"
					/>
				</div>
			</section>
			{roomInfo && (
				<section className={styles.progressSection}>
					<StatueBar
						numOfUsersCompleted={completedCount}
						totalNumOfUsers={roomInfo.total_participants}
					/>
				</section>
			)}
			<section className={styles.listSection}>
				<div className={styles.sectionHeader}>
					<div className={styles.sectionTitle}>Participant List</div>
					<div className={styles.sectionMeta}>
						<BellRing size={16} />
						완료 여부를 즉시 확인
					</div>
				</div>
				<div className={styles.statusContainer}>
					{userList.map((ele) => (
						<ResponsedBar
							key={ele.id}
							isChecked={ele.completed}
							name={ele.name}
							status={ele.completed ? "Completed" : "Pending"}
						/>
					))}
				</div>
			</section>
		</div>
	);
}

export default ProgressPage;
