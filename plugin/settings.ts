import {App, PluginSettingTab, Setting} from "obsidian";
import NoticeMe from "./main";
import {t} from "./i18n";
import {NoticeMesssageModal} from "./modal";

export default class NoticeMeSettingTab extends PluginSettingTab {
	plugin: NoticeMe;
	
	constructor(app: App, plugin: NoticeMe) {
		super(app, plugin);
		this.plugin = plugin;
	}
	
	randomMessage(): string {
		const messageIdea = t("messageIdea") as string;
		const messageIdeaArray = Object.values(messageIdea);
		const random = Math.floor(Math.random() * messageIdeaArray.length);
		return messageIdeaArray[random];
	}
	
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h1", {text: t("title") as string});
		const el = containerEl.createEl("p", {text: t("desc") as string});
		const ul = el.createEl("ul");
		ul.createEl("li", {text: t("interval") as string});
		const li = ul.createEl("li", {text: t("duration.desc") as string});
		li.createEl("br");
		li.createEl("span", {text: t("duration.disable") as string});

		const settings = this.plugin.settings;
		
		for (let notice of settings.NoticeMessage) {
			const noticeSettings=new Setting(containerEl)
				.setClass("notice-me-settings")
				.addText(text =>
					text
						.setPlaceholder("Message")
						.setValue(notice.message)
						.onChange(async (value) => {
							notice.message = value;
							notice.id = this.plugin.editInterval(notice);
							await this.plugin.saveSettings();
						})
						.inputEl.addClass("message"));
				
			noticeSettings
				.addButton(button =>
					button
						.setIcon("pencil")
						.onClick(async () => {
							new NoticeMesssageModal(this.app, notice, async (result) => {
								notice = result;
								this.plugin.saveSettings();
							}).open();
						}))
				.addButton(button =>
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
							message: this.randomMessage(),
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
