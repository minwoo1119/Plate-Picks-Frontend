import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import { ArrowRight } from 'lucide-react';
import api from '../../api/api';
import styles from './joinPage.module.scss';

function JoinPage() {
    const [inviteCode, setInviteCode] = useState('');
    const [name, setName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const roomId = location.state?.roomId ?? '';
    const roomCode = location.state?.roomCode ?? '';

    const handleBtnClick = async () => {
        try {
            const response = roomId
                ? await api.post('/participants', {
                      name,
                      roomId,
                  })
                : await api.post('/participants/join-by-code', {
                      name,
                      code: inviteCode,
                  });
            console.log('userID : ', response.data.id);

            navigate('/survey', {
                state: {
                    name,
                    participantId: response.data.id,
                    roomId: response.data.roomId,
                },
            });
        } catch (err) {
            console.error('참가 중 오류 발생', err);
        }
    };

    useEffect(() => {
        if (roomCode) {
            setInviteCode(roomCode);
        } else if (roomId) {
            setInviteCode('');
        } else {
            setInviteCode('');
        }
    }, [roomCode, roomId]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header text='모임 참여' eyebrow='Join a room' />
                <div className={styles.titleText}>함께 메뉴를 정해볼까요?</div>
                <div className={styles.groupId}>
                    {roomId
                        ? `모임 코드 : ${roomCode || '확인 중'}`
                        : `모임 코드 : ${inviteCode || '입력 필요'}`}
                </div>
                <div className={styles.description}>
                    이름을 입력한 후 메뉴 선정을 위해 선호도를 입력해주세요.
                    모든 참가자의 선호도를 바탕으로 최적의 메뉴를
                    추천해드립니다.
                </div>
                {!roomId && (
                    <Input
                        label='초대 코드'
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder='초대 코드를 입력하세요.'
                        type='text'
                        value={inviteCode}
                    />
                )}
                <Input
                    label='이름'
                    onChange={(e) => setName(e.target.value)}
                    placeholder='이름을 입력하세요.'
                    type='text'
                    value={name}
                />
                <div className={styles.inlineHint}>
                    <ArrowRight size={16} />
                    응답 완료 후 다른 참가자들의 진행 상황을 바로 확인합니다.
                </div>
                <Button
                    text='응답 시작'
                    color='#2F6B3D'
                    fontColor='white'
                    onClick={() => handleBtnClick()}
                    disabled={
                        name.trim().length === 0 ||
                        (!roomId && inviteCode.trim().length === 0)
                    }
                    variant='primary'
                />
            </div>
        </div>
    );
}

export default JoinPage;
