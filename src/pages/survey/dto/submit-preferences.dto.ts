export interface Preference {
    foodId: string;
    preference: 'Good' | 'Soso' | 'Bad';
}

export interface SubmitPreferencesDto {
    participantId: string;
    preferences: Preference[];
}
