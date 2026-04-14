import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import { Check } from 'lucide-react';
import CopyTextForm from '../../components/common/CopyTextForm';
import Header from '../../components/common/Header';
import styles from './partyCreatedPage.module.scss';

function PartyCreatedPage() {
    const [inviteCode, setInviteCode] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const roomId = location.state?.roomId ?? '';
    const roomCode = location.state?.roomCode ?? '';

    useEffect(() => {
        setInviteCode(roomCode);
    }, [roomCode]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header
                    align='center'
                    text='모임 준비가 끝났습니다.'
                    description='초대 코드를 공유하면 참가자들이 바로 입장해서 추천 후보 평가를 시작할 수 있습니다.'
                />
                <div className={styles.checkContainer}>
                    <Check className={styles.icon} />
                    <div className={styles.mainText}>초대 코드만 전달하면 됩니다.</div>
                    <div className={styles.subText}>
                        참가자는 코드 입력 후 바로 조건 기반 메뉴 평가를
                        시작합니다.
                    </div>
                </div>
                <CopyTextForm text={inviteCode} />
                <div className={styles.infoBox}>
                    <div className={styles.infoTitle}>
                        다음 단계는 무엇인가요 ?
                    </div>
                    <div className={styles.infos}>
                        <div>1. 코드를 모아 참가자들과 공유하세요.</div>
                        <div>
                            2. 각 참가자는 간단한 음식 선호도 설문을 완료합니다.
                        </div>
                        <div>
                            3. 모든 참가자가 설문을 완료하면 메뉴 추천이
                            생성됩니다.
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.buttonArea}>
                <Button
                    text='내 모임으로 계속하기'
                    onClick={() =>
                        navigate('/join', {
                            state: { roomId, roomCode: inviteCode },
                        })
                    }
                    color='#2F6B3D'
                    fontColor='white'
                    variant='primary'
                />
            </div>
        </div>
    );
}

export default PartyCreatedPage;
