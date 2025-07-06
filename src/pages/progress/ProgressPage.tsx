import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../../components/common/Header';
import ResponsedBar from '../../components/common/ResponsedBar';
import StatueBar from '../../components/common/StatusBar';
import { Users } from 'lucide-react';
import axios from 'axios';
import styles from './progressPage.module.scss';

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

function ProgressPage() {
    const location = useLocation();
    const roomId = location.state.roomId;
    const [userList, setUserList] = useState<RoomUserInfo[]>([]);
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState<RoomInfo>();

    const getRoomInfo = async () => {
        try {
            const response = await axios.get(
                `http://119.56.230.161:7777/room/${roomId}/status`,
            );
            console.log('방 정보 : ', response.data);
            setRoomInfo(response.data);
        } catch (err) {
            console.error('에러 발생', err);
        }
    };

    const getRoomParticipateInfo = async () => {
        try {
            const response = await axios.get(
                `http://119.56.230.161:7777/room/participants/${roomId}`,
            );
            console.log('응답 정보 : ', response.data);
            setUserList(response.data);
        } catch (err) {
            console.error('에러 발생', err);
        }
    };

    useEffect(() => {
        getRoomParticipateInfo();
        getRoomInfo();

        const eventSource = new EventSource(
            `http://119.56.230.161:7777/sse/${roomId}`,
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('SSE 수신:', data);

            if (data.type === 'participant-completed') {
                getRoomParticipateInfo();
                getRoomInfo();
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE 오류:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        const completed = userList.filter((u) => u.completed).length;
        const total = roomInfo?.total_participants ?? 0;

        if (completed === total && total > 0) {
            navigate('/recommand', { state: { roomId } });
        }
    }, [userList]);

    return (
        <div className={styles.container}>
            <Header text='모임 진행 상황' />
            <div className={styles.statusBox}>
                <Users className={styles.icon} />
                <div className={styles.titleText}>응답 대기 중</div>
                <div className={styles.subText}>
                    다른 참가자들이 설문을 완료할 때까지 기다려주세요.
                </div>
            </div>
            {roomInfo && (
                <StatueBar
                    numOfUsersCompleted={
                        userList.filter((ele) => ele.completed).length
                    }
                    totalNumOfUsers={roomInfo.total_participants}
                />
            )}
            <div className={styles.statusContainer}>
                {userList.map((ele) => (
                    <ResponsedBar
                        key={ele.id}
                        isChecked={ele.completed}
                        name={ele.name}
                        status={ele.completed == true ? '완료됨' : '대기 중'}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProgressPage;
