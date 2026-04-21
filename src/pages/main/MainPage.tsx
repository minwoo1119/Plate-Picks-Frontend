import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../../api/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import heroImage from "../../img/main_title.png";
import styles from "./mainpage.module.scss";

function MainPage() {
	const [numOfPeople, setNumOfPeople] = useState(0);
	const navigate = useNavigate();

	const handleMakeBtnClick = async () => {
		try {
			const response = await api.post("/room", {
				total_participants: numOfPeople,
			});

			navigate("/party-created", {
				state: {
					numOfPeople,
					roomCode: response.data.code,
					roomId: response.data.id,
				},
			});
		} catch (err) {
			console.error("방 생성 실패", err);
		}
	};

	return (
		<div className={styles.container}>
			<section className={styles.heroContent}>
				<div className={styles.badge}>Plate Picks</div>
				<div className={styles.titleBox}>
					<h1 className={styles.title}>Start organizing a group meal</h1>
					<p className={styles.subtitle}>
						인원 수만 정하면 취향 수집부터 최종 메뉴 추천까지 한 번에
						이어집니다.
					</p>
				</div>
				<div className={styles.previewCard}>
					<div className={styles.previewCopy}>
						<div className={styles.previewLabel}>Modern Minimalist</div>
						<div className={styles.previewTitle}>
							조건 설정, 취향 투표, 결과 확인까지 모바일 우선 흐름으로
							정리했습니다.
						</div>
					</div>
					<div className={styles.heroImageFrame}>
						<img
							src={heroImage}
							alt="Plate Picks"
							className={styles.heroImage}
						/>
					</div>
				</div>
				<div className={styles.descriptionList}>
					<div className={styles.descriptionItem}>
						<Users size={18} />
						<span>그룹 식사 결정을 빠르게 끝내는 간결한 3단계 플로우</span>
					</div>
					<div className={styles.descriptionItem}>
						<ArrowRight size={18} />
						<span>응답 진행 상황이 실시간으로 반영되고 자동으로 다음 화면으로 이동</span>
					</div>
				</div>
			</section>

			<section className={styles.inputBox}>
				<div className={styles.sectionEyebrow}>Home Screen</div>
				<div className={styles.formTitle}>새 그룹 만들기</div>
				<Input
					label="참가자 수"
					onChange={(e) => setNumOfPeople(e.target.valueAsNumber)}
					placeholder="예: 4"
					value={Number.isNaN(numOfPeople) ? "" : numOfPeople || ""}
					hint="몇 명이 함께 메뉴를 고를지 입력하세요."
				/>
				<Button
					text="Create Group"
					onClick={handleMakeBtnClick}
					disabled={!numOfPeople || numOfPeople < 1}
					variant="primary"
				/>
				<Button
					text="Join Existing Group"
					onClick={() => navigate("/join", { state: { roomId: null } })}
					variant="secondary"
				/>
				<div className={styles.helperRow}>
					<ArrowRight size={16} />
					초대 링크 없이 코드만으로 바로 참가할 수 있습니다.
				</div>
			</section>
		</div>
	);
}

export default MainPage;
