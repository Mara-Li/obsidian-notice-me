import {App, Modal, Setting, Notice} from "obsidian";
import {t} from "./i18n";
import {NoticeMessage, Timer} from "./interface";

export class NoticeMesssageModal extends Modal {
	result: NoticeMessage;
	onSubmit: (result: NoticeMessage) => void;
	
	constructor(app: App, result: NoticeMessage, onSubmit: (result: NoticeMessage) => void) {
		super(app);
		this.result = result;
		this.onSubmit = onSubmit;
	}
	
	checkTimer(timer: string): boolean {
		if (timer === "" || timer === null || isNaN(parseInt(timer))) {
			new Notice(t("error.number") as string);
			return false;
		}
		return true;
	}
	
	addError(timeSetting: Setting[]): void {
		for (const setting of timeSetting) {
			setting.controlEl.addClass("is-error");
		}
	}
	

	
	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		contentEl.createEl("h2", {text: t("interval") as string});
		const hour = new Setting(contentEl)
			.setClass("notice-me-modal")
			.setName(t("time.hour") as string)
			.addText(text => {
				text.setValue(this.result.interval.hour.toString());
				text.onChange(async (value) => {
					if (this.checkTimer(value)) {
						this.result.interval.hour = parseInt(value);
						text.inputEl.removeClass("is-error");
					} else {
						text.inputEl.addClass("is-error");
					}
				});
			});
		const min = new Setting(contentEl)
			.setClass("notice-me-modal")
			.setName(t("time.minute") as string)
			.addText(text => {
				text.setValue(this.result.interval.minute.toString());
				text.onChange(async (value) => {
					if (this.checkTimer(value)) {
						this.result.interval.minute = parseInt(value);
						text.inputEl.removeClass("is-error");
					} else {
						text.inputEl.addClass("is-error");
					}
				});
			});
		const seconds = new Setting(contentEl)
			.setName(t("time.second") as string)
			.setClass("notice-me-modal")
			.addText(text => {
				text.setValue(this.result.interval.second.toString());
				text.onChange(async (value) => {
					if (this.checkTimer(value)) {
						this.result.interval.second = parseInt(value);
					} else {
						text.inputEl.addClass("is-error");
					}
				});
			});
		
		contentEl.createEl("h2", {text: t("duration.title") as string});
		new Setting(contentEl)
			.setClass("notice-me-modal")
			.setDesc(t("duration.desc") as string)
			.addText(text => {
				text.setValue(this.result.noticeLength.toString());
				text.onChange(async (value) => {
					if (this.checkTimer(value)) {
						this.result.noticeLength = parseInt(value);
						text.inputEl.removeClass("is-error");
					} else {
						text.inputEl.addClass("is-error");
					}
				});
			});
		
		new Setting(contentEl)
			.addButton(button => {
				button.setButtonText(t("submit") as string);
				button.onClick(() => {
					const totalTime = this.result.interval.hour * 60 * 60 + this.result.interval.minute * 60 + this.result.interval.second;
					if (totalTime < 30) {
						this.addError([hour, min, seconds]);
						new Notice(t("error.interval") as string);
					}
					else {
						this.onSubmit(this.result);
						this.close();
					}
				});
			});
	}
}
