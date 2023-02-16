import {Notice, Plugin} from "obsidian";
import {DEFAULT_SETTINGS, NoticeMeSettings, NoticeMessage} from "./interface";
import NoticeMeSettingTab from "./settings";

// Remember to rename these classes and interfaces!

export default class NoticeMe extends Plugin {
	settings: NoticeMeSettings;

	loadInterval(notice: NoticeMessage): number {
		return this.registerInterval(window.setInterval(() =>
			new Notice(notice.message, notice.noticeLength), notice.interval.hour * 60 * 60 * 1000 + notice.interval.minute * 60 * 1000 + notice.interval.second * 1000));
	}
	
	editInterval(notice: NoticeMessage): number {
		//delete old interval
		window.clearInterval(notice.id);
		//create new interval
		return this.registerInterval(window.setInterval(() =>
			new Notice(notice.message, notice.noticeLength), notice.interval.hour * 60 * 60 * 1000 + notice.interval.minute * 60 * 1000 + notice.interval.second * 1000));
	}
	
	deleteInterval(notice: NoticeMessage): void {
		window.clearInterval(notice.id);
	}
	
	async onload() {
		console.log("Loading NoticeMe plugin");
		await this.loadSettings();
		this.addSettingTab(new NoticeMeSettingTab(this.app, this));
		
		for (const notice of this.settings.NoticeMessage) {
			notice.id = this.loadInterval(notice);
			await this.saveSettings();
		}
	}

	onunload() {
		console.log("Unloading NoticeMe plugin");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


