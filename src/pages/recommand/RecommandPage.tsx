import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import RemainPoint from "../../components/common/RemainPoint";
import ResultFoodBox from "../../components/resultFoodBox/ResultFoodBox";
import styles from "./recommandPage.module.scss";

function RecommandPage() {
	const [remainPoint, setRemainPoint] = useState(0);
	const handleRetry = () => {
		console.log("다시 추천받기 버튼 클릭");
		// 여기에 다시 추천받기 로직을 추가하세요.
	};
	useEffect(() => {
		setRemainPoint(2);
	});
	return (
		<div className={styles.container}>
			<Header text="메뉴 추천" />
			<RemainPoint remainCnt={remainPoint} />
			<div className={styles.textArea}>
				<div className={styles.title}>추천 메뉴</div>
				<div className={styles.subTitle}>여러분의 의견에 맞는 음식입니다 !</div>
			</div>
			<div className={styles.recommendBox}>
				<ResultFoodBox
					imgUrl="/"
					foodName="삼겹살"
					foodInfo="삼겹살에 소주 캬~"
				/>
				<ResultFoodBox
					imgUrl="/"
					foodName="엄마의 집밥"
					foodInfo="엄마가 해주는 집밥이 최고지!"
				/>
			</div>
			<div className={styles.buttonArea}>
				<Button
					onClick={() => handleRetry()}
					text="다시 추천받기"
					color="#5046E5"
					disabled={remainPoint <= 0}
					fontColor="white"
				/>
				<Button
					onClick={() => handleRetry()}
					text="광고 보고 포인트 충전하기"
				/>
			</div>
		</div>
	);
}

export default RecommandPage;
