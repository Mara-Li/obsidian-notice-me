export interface NoticeMeSettings {
	NoticeMessage: NoticeMessage[];
}

export interface NoticeMessage {
	message: string;
	interval: Timer;
	id: number;
	noticeLength: number;
}

export const DEFAULT_SETTINGS: NoticeMeSettings = {
	NoticeMessage: []
};

export interface Timer {
	hour: number;
	minute: number;
	second: number;
}

