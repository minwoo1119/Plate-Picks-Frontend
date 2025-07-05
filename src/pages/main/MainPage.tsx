import Button from '../../components/common/Button';
import { EggFried } from 'lucide-react';
import Input from '../../components/common/Input';
import axios from 'axios';
import styles from './mainpage.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function MainPage() {
    const [numOfPeople, setNumOfPeople] = useState(0);
    const navigate = useNavigate();
    const handleMakeBtnClick = async () => {
        try {
            const response = await axios.post(
                'http://119.56.230.161:7777/room',
                {
                    total_participants: numOfPeople,
                },
            );

            const roomCode = response.data.code;

            console.log('방 생성 성공, 코드:', roomCode);

            navigate('/party-created', {
                state: {
                    numOfPeople,
                    roomCode,
                },
            });
        } catch (err) {
            console.error('방 생성 실패', err);
        }
    };
    const handleJoinBtnClick = () => {
        console.log('모임 참여 페이지 이동');
        navigate('/join');
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleBox}>
                <EggFried />

                <div className={styles.title}>Plate Picks</div>
                <div className={styles.subtitle}>
                    쉽고 간단하게 메뉴를 골라드릴게요 !
                </div>
            </div>

            <div className={styles.inputBox}>
                <Input
                    label='참가자 수'
                    onChange={(e) => setNumOfPeople(e.target.valueAsNumber)}
                    placeholder='인원 수를 입력하세요.'
                />
                <Button
                    text='모임 만들기'
                    color='#5046E5'
                    onClick={handleMakeBtnClick}
                    fontColor='white'
                />
                <hr />
                <Button
                    text='기존 모임 참여하기'
                    color='white'
                    onClick={handleJoinBtnClick}
                />
            </div>
        </div>
    );
}

export default MainPage;
