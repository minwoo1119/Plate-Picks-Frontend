import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../../components/common/Header';
import ResponsedBar from '../../components/common/ResponsedBar';
import StatueBar from '../../components/common/StatusBar';
import { Users } from 'lucide-react';
import api from '../../api/api';
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

type ParticipantEventPayload = {
    participantId: string;
    participantName: string;
    participants: RoomUserInfo[];
    type: 'participant-joined' | 'participant-completed';
};

function ProgressPage() {
    const location = useLocation();
    const roomId = location.state.roomId;
    const [userList, setUserList] = useState<RoomUserInfo[]>([]);
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState<RoomInfo>();

    const getRoomInfo = async () => {
        try {
            const response = await api.get(`/room/${roomId}/status`);
            console.log('방 정보 : ', response.data);
            setRoomInfo(response.data);
        } catch (err) {
            console.error('에러 발생', err);
        }
    };

    const getRoomParticipateInfo = async () => {
        try {
            const response = await api.get(`/room/participants/${roomId}`);
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
            `https://api.platepicks.pics/sse/${roomId}`,
        );

        eventSource.onmessage = (event) => {
            const data: ParticipantEventPayload = JSON.parse(event.data);
            console.log('SSE 수신:', data);

            if (
                data.type === 'participant-joined' ||
                data.type === 'participant-completed'
            ) {
                setUserList(data.participants);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE 오류:', err);
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
            navigate('/recommand', { state: { roomId } });
        }
    }, [navigate, roomId, roomInfo?.total_participants, userList]);

    return (
        <div className={styles.container}>
            <div className={styles.heroPanel}>
                <Header
                    text='응답을 기다리는 중입니다.'
                    description='참가자가 입장하거나 응답을 완료하면 목록이 바로 갱신됩니다.'
                />
                <div className={styles.statusBox}>
                    <Users className={styles.icon} />
                    <div className={styles.titleText}>
                        현재 {userList.filter((ele) => ele.completed).length}명
                        이 응답을 마쳤어요
                    </div>
                    <div className={styles.subText}>
                        남은 참가자들이 추천 후보를 평가하면 자동으로 결과
                        화면으로 이동합니다.
                    </div>
                </div>
            </div>
            {roomInfo && (
                <div className={styles.progressSection}>
                    <StatueBar
                        numOfUsersCompleted={
                            userList.filter((ele) => ele.completed).length
                        }
                        totalNumOfUsers={roomInfo.total_participants}
                    />
                </div>
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
