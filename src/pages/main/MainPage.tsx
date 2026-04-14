import Button from '../../components/common/Button';
import { ArrowRight } from 'lucide-react';
import Input from '../../components/common/Input';
import api from '../../api/api';
import heroImage from '../../img/main_title.png';
import styles from './mainpage.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function MainPage() {
    const [numOfPeople, setNumOfPeople] = useState(0);
    const navigate = useNavigate();
    const handleMakeBtnClick = async () => {
        try {
            const response = await api.post('/room', {
                total_participants: numOfPeople,
            });

            const roomCode = response.data.code;
            const roomId = response.data.id;

            console.log('방 생성 성공, 코드:', roomCode);
            console.log('방 생성 성공, ID:', roomId);

            navigate('/party-created', {
                state: {
                    numOfPeople,
                    roomCode,
                    roomId,
                },
            });
        } catch (err) {
            console.error('방 생성 실패', err);
        }
    };
    const handleJoinBtnClick = () => {
        console.log('모임 참여 페이지 이동');
        navigate('/join', { state: { roomId: null } });
    };

    return (
        <div className={styles.container}>
            <div className={styles.heroContent}>
                <div className={styles.titleBox}>
                    <div className={styles.heroImageFrame}>
                        <img
                            src={heroImage}
                            alt='Plate Picks'
                            className={styles.heroImage}
                        />
                    </div>
                    <div className={styles.subtitle}>
                        모임 인원만 입력하면, 각자의 취향을 빠르게 모아서
                        깔끔하게 메뉴를 정리합니다.
                    </div>
                </div>

                <div className={styles.descriptionList}>
                    <div className={styles.descriptionItem}>
                        방 생성, 취향 응답, 메뉴 추천까지 3단계로 빠르게
                        진행됩니다.
                    </div>
                    <div className={styles.descriptionItem}>
                        참가자들의 응답 상태를 실시간으로 확인하면서 바로
                        다음 단계로 넘어갈 수 있습니다.
                    </div>
                </div>
            </div>

            <div className={styles.inputBox}>
                <div className={styles.sectionTitle}>새 모임 시작</div>
                <Input
                    label='참가자 수'
                    onChange={(e) => setNumOfPeople(e.target.valueAsNumber)}
                    placeholder='예: 4'
                    value={Number.isNaN(numOfPeople) ? '' : numOfPeople || ''}
                />
                <Button
                    text='모임 만들기'
                    color='#2F6B3D'
                    onClick={handleMakeBtnClick}
                    fontColor='white'
                    variant='primary'
                />
                <div className={styles.divider}>or</div>
                <Button
                    text='기존 모임 참여하기'
                    onClick={handleJoinBtnClick}
                />
                <div className={styles.helperRow}>
                    <ArrowRight size={16} />
                    링크 없이 코드만으로 바로 참여할 수 있습니다.
                </div>
            </div>
        </div>
    );
}

export default MainPage;
