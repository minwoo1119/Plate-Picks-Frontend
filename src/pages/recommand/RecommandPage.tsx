import { Bookmark, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../../api/api";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import RemainPoint from "../../components/common/RemainPoint";
import ResultFoodBox from "../../components/resultFoodBox/ResultFoodBox";
import styles from "./recommandPage.module.scss";

export interface Recommandation {
	id: string;
	name: string;
	description: string;
	imgUrl: string;
}

function RecommandPage() {
	const location = useLocation();
	const [remainPoint, setRemainPoint] = useState(0);
	const roomId = location.state.roomId;
	const [recommandMenu, setRecommandMenu] = useState<Recommandation>();

	const handleRetry = () => {
		setRemainPoint((prev) => prev - 1);
		void (async () => {
			try {
				const response = await api.get(`/preferences/result/${roomId}`);
				setRecommandMenu(response.data);
			} catch (err) {
				console.error("에러 발생!", err);
			}
		})();
	};

	useEffect(() => {
		const initializeRecommendation = async () => {
			try {
				const response = await api.get(`/preferences/result/${roomId}`);
				setRecommandMenu(response.data);
			} catch (err) {
				console.error("에러 발생!", err);
			}
		};

		setRemainPoint(2);
		void initializeRecommendation();
	}, [roomId]);

	return (
		<div className={styles.container}>
			<section className={styles.heroSection}>
				<div className={styles.heroTop}>
					<Header
						text="The Perfect Match"
						description="참가자 응답을 바탕으로 가장 수긍하기 쉬운 최종 메뉴를 골랐습니다."
					/>
					<RemainPoint remainCnt={remainPoint} />
				</div>
				<div className={styles.summaryCard}>
					<div className={styles.summaryLabel}>Final Recommendation</div>
					<div className={styles.summaryTitle}>
						오늘 모임에 가장 잘 맞는 메뉴를 찾았습니다.
					</div>
					<div className={styles.summaryText}>
						설명, 취향 응답, 그룹 균형도를 반영해 가장 안정적인 선택지를
						우선 배치했습니다.
					</div>
				</div>
			</section>
			<div className={styles.recommendBox}>
				<ResultFoodBox
					imgUrl={recommandMenu?.imgUrl ?? ""}
					foodName={recommandMenu?.name ?? ""}
					foodInfo={recommandMenu?.description ?? ""}
				/>
			</div>
			<div className={styles.buttonArea}>
				<Button
					onClick={handleRetry}
					text="Get Recommendation Again"
					disabled={remainPoint <= 0}
					variant="primary"
				/>
				<Button
					onClick={() => window.alert("저장 기능은 아직 연결되지 않았습니다.")}
					text="Save to Profile"
					variant="secondary"
				/>
				<div className={styles.metaRow}>
					<div className={styles.metaItem}>
						<RotateCcw size={16} />
						재추천은 남은 포인트 내에서 가능합니다.
					</div>
					<div className={styles.metaItem}>
						<Bookmark size={16} />
						마음에 드는 결과는 저장 흐름으로 확장 가능합니다.
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecommandPage;
