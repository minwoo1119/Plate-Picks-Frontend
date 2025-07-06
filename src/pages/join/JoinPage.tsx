import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import { Users } from 'lucide-react';
import axios from 'axios';
import styles from './joinPage.module.scss';

function JoinPage() {
    const [title, setTitle] = useState('default title');
    const [partyId, setPartyId] = useState('ajksn12knd');
    const [name, setName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const roomId = location.state.roomId;
    const handleBtnClick = async () => {
        try {
            const response = await axios.post(
                'http://119.56.230.161:7777/participants',
                {
                    name: name,
                    roomId: partyId,
                },
            );
            console.log('userID : ', response.data.id);

            navigate('/survey', {
                state: {
                    name,
                    participantId: response.data.id,
                    roomId: roomId,
                },
            });
        } catch (err) {
            console.error('참가 중 오류 발생', err);
        }
    };
    useEffect(() => {
        if (!location.state.roomId) {
            setPartyId('');
        } else {
            setPartyId(roomId);
        }
    }, []);
    return (
        <div className={styles.container}>
            <Header text='모임 참여' />
            <div className={styles.content}>
                <Users />
                <div className={styles.titleText}>{title}</div>
                <div className={styles.groupId}>모임 ID : {partyId}</div>
                <div className={styles.description}>
                    이름을 입력한 후 메뉴 선정을 위해 선호도를 입력해주세요.
                    모든 참가자의 선호도를 바탕으로 최적의 메뉴를
                    추천해드립니다.
                </div>
                {!location.state.roomId && (
                    <Input
                        label='roomID'
                        onChange={(e) => setPartyId(e.target.value)}
                        placeholder='방 ID를 입력하세요.'
                        type='text'
                    />
                )}
                <Input
                    label='이름'
                    onChange={(e) => setName(e.target.value)}
                    placeholder='이름을 입력하세요.'
                    type='text'
                />
            </div>
            <Button
                text='응답 시작'
                color='#5046E5'
                fontColor='white'
                onClick={() => handleBtnClick()}
                disabled={name.length === 0}
            />
        </div>
    );
}

export default JoinPage;
