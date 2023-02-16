import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import NoticeMe from "./main";
import {NoticeMessage, Timer} from "./interface";
import {t} from "./i18n";

export default class NoticeMeSettingTab extends PluginSettingTab {
	plugin: NoticeMe;
	
	constructor(app: App, plugin: NoticeMe) {
		super(app, plugin);
		this.plugin = plugin;
	}

	createInfo(setting: Setting, time: string, durationClass=false):
		void {
		const width: number = (t("noticeLength") as string).length;
		setting
			.addText(text => {
				text.setValue(time);
				text.setDisabled(true);
				text.inputEl.addClasses(["notice-me", "settingsTab", "info"]);
				if (durationClass) {
					text.inputEl.style.width = `${width}ch`;
				}
			});
	}
	
	checkCompleteTimer(notice: NoticeMessage, inputEl: HTMLElement): Timer {
		//Calculate total length time
		const total = notice.interval.hour * 60 * 60 + notice.interval.minute * 60 + notice.interval.second;
		if (total < 30) {
			inputEl.addClass("is-error");
			notice.interval.second = 30;
		} else {
			inputEl.removeClass("is-error");
		}
		return notice.interval;
	}
	
	
	checkTimer(timer: string, inputEl: HTMLElement): number {
		if (timer === "" || timer === null || isNaN(parseInt(timer))) {
			new Notice(t("error") as string);
			inputEl.addClass("is-error");
			return 30;
		}
		return parseInt(timer);
	}
	
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h1", {text: t("title") as string});
		const el = containerEl.createEl("p", {text: t("desc") as string});
		const ul = el.createEl("ul");
		ul.createEl("li", {text: t("interval") as string});
		const li = ul.createEl("li", {text: t("duration") as string});
		li.createEl("br");
		li.createEl("span", {text: t("disableDuration") as string});

		const settings = this.plugin.settings;
		
		for (const notice of settings.NoticeMessage) {
			const noticeSettings=new Setting(containerEl)
				.setClass("notice-me")
				.setClass("settingsTab")
				.addText(text =>
					text
						.setPlaceholder("Message")
						.setValue(notice.message)
						.onChange(async (value) => {
							notice.message = value;
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();
						})
						.inputEl.addClass("message"))
				.addText(text =>
					text
						.setPlaceholder(t("time.hour") as string)
						.setValue(notice.interval.hour.toString())
						.onChange(async (value) => {
							notice.interval.hour = this.checkTimer(value, text.inputEl);
							notice.interval = this.checkCompleteTimer(notice, text.inputEl);
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();
						})
						.inputEl.addClass("timer"));
			this.createInfo(noticeSettings, "h");
			noticeSettings
				.addText(text =>
					text
						.setPlaceholder(t("time.minute") as string)
						.setValue(notice.interval.minute.toString())
						.onChange(async (value) => {
							notice.interval.minute = this.checkTimer(value, text.inputEl);
							notice.interval = this.checkCompleteTimer(notice, text.inputEl);
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();

						})
						.inputEl.addClass("timer"));
			this.createInfo(noticeSettings, "m");
			noticeSettings
				.addText(text =>
					text
						.setPlaceholder(t("time.second") as string)
						.setValue(notice.interval.second.toString())
						.onChange(async (value) => {
							notice.interval.second = this.checkTimer(value, text.inputEl);
							notice.interval = this.checkCompleteTimer(notice, text.inputEl);
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();
						})
						.inputEl.addClass("timer"));
			
			this.createInfo(noticeSettings, "s");
			this.createInfo(noticeSettings, t("noticeLength") as string, true);
			noticeSettings
				.addText(text =>
					text
						.setPlaceholder(t("noticeLength") as string)
						.setValue(notice.noticeLength.toString())
						.onChange(async (value) => {
							notice.noticeLength = this.checkTimer(value, text.inputEl);
							notice.interval = this.checkCompleteTimer(notice, text.inputEl);
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();
						})
						.inputEl.addClasses(["timer", "duration"]));
			noticeSettings.addButton(button =>
				button
					.setIcon("cross")
					.onClick(async () => {
						this.plugin.deleteInterval(notice);
						settings.NoticeMessage = settings.NoticeMessage.filter((item) => item.id !== notice.id);
						await this.plugin.saveSettings();
						this.display();
					}));
		}
		new Setting(containerEl)
			.addButton(button =>
				button
					.setButtonText(t("add") as string)
					.onClick(async () => {
						const notice = {
							message: "Notice Message",
							noticeLength: 500,
							interval: {
								hour: 0,
								minute: 30,
								second: 0,
							},
							id: 0};
						notice.id = this.plugin.loadInterval(notice);
						settings.NoticeMessage.push(notice);
						await this.plugin.saveSettings();
						this.display();
					}));
	}
}
